import to from 'await-to-js'
import dayjs from 'dayjs'
import { sql } from 'drizzle-orm'
import { eq } from 'drizzle-orm/expressions'
import { pick } from 'lodash-es'
import { infer as Infer, literal, object, string, union } from 'zod'

import { zValidator } from '@hono/zod-validator'
import { User } from '@schema'
import { createToken, now, updateRefreshToken, verifyToken } from '@server/utils'
import { user_data } from '@server/zod'

import type { TypedResponse } from 'hono'
import type { GetValidateData } from '@server/types'

const data_type = user_data.pick({ refresh_token: true, token: true })
const user_type = user_data.omit({ refresh_token: true, token: true })

const input_type = object({
	mid: string(),
	id: string(),
	token: string(),
	refresh_token: string(),
	platform: union([literal('macos'), literal('windows')]).optional()
})

const output_type = union([
	object({ error: literal('input_type_error') }),
	object({ error: literal('token_verify_error') }),
	object({ error: literal('user_not_exist') }),
	object({ error: literal('refresh_token_not_exist') }),
	object({ error: literal('refresh_token_verify_error') }),
	object({ error: literal('db_update_error') }),
	object({ error: literal(null), ok: literal('refresh_all'), data: data_type, user: user_type }),
	object({ error: literal(null), ok: literal('ok'), data: string(), user: user_type })
])

type Input = Infer<typeof input_type>
type OutputRefreshToken = Promise<TypedResponse<Infer<typeof output_type>>>

const handler = async (c: AppContext<GetValidateData<Input>>): OutputRefreshToken => {
	const { mid, id, token: user_token, refresh_token: user_refresh_token, platform } = c.req.valid('json')

	const [err_verify_token] = await verifyToken(user_token, c.env.token_secret)

	if (err_verify_token && err_verify_token.name !== 'JwtTokenExpired') {
		return c.json({ error: 'token_verify_error' })
	}

	const res_user = await c.var.$db.select().from(User).where(eq(User.id, id)).get()

	if (!res_user) return c.json({ error: 'user_not_exist' })

	const { refresh_tokens } = res_user
	const { refresh_token: db_refresh_token } = refresh_tokens![mid]

	if (db_refresh_token !== user_refresh_token) return c.json({ error: 'refresh_token_not_exist' })

	const [err_verify_refresh_token, res_verify_refresh_token] = await verifyToken(
		user_refresh_token,
		c.env.token_secret
	)

	if (err_verify_refresh_token) return c.json({ error: 'refresh_token_verify_error' })

	const { exp } = res_verify_refresh_token
	const close = exp! - now() <= 518400

	const user = {
		id,
		...pick(res_user, ['name', 'email', 'avatar', 'paid_plan', 'paid_expire', 'is_infinity'])
	}

	if (close) {
		const refresh_token = await createToken({ id, mid }, c.env.token_secret, true)
		const token = await createToken({ id, mid }, c.env.token_secret)

		updateRefreshToken({ refresh_tokens: refresh_tokens!, mid, platform: platform!, refresh_token })

		Object.keys(refresh_tokens!).forEach(key => {
			if (key !== mid) {
				const { used_at } = refresh_tokens![key]

				if (dayjs(now() * 1000).diff(dayjs(used_at * 1000)) > 15) {
					delete refresh_tokens![key]
				}
			}
		})

		const [err] = await to(
			c.var.$db
				.update(User)
				.set({ login_at: now(), refresh_tokens: sql`${JSON.stringify(refresh_tokens)}` })
				.where(eq(User.id, id))
		)

		if (err) return c.json({ error: 'db_update_error' })

		return c.json({ error: null, ok: 'refresh_all', data: { refresh_token, token }, user })
	} else {
		const token = await createToken({ id, mid }, c.env.token_secret)

		const [err] = await to(c.var.$db.update(User).set({ login_at: now() }).where(eq(User.id, id)))

		if (err) return c.json({ error: 'db_update_error' })

		return c.json({ error: null, ok: 'ok', data: token, user })
	}
}

export default {
	validator: zValidator('json', input_type),
	handler
}
