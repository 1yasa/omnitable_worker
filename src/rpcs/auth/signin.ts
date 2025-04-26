import to from 'await-to-js'
import { sql } from 'drizzle-orm'
import { eq } from 'drizzle-orm/expressions'
import { literal, object, string, union } from 'zod'

import { User } from '@schema'
import { createToken, now, p, updateRefreshToken, verifyPassword } from '@server/utils'
import { user_data } from '@server/zod'

const input_type = object({
	mid: string(),
	email: string().email(),
	password: string(),
	platform: union([literal('macos'), literal('windows')]).optional()
})

const output_type = union([
	object({ error: literal('user_not_exist') }),
	object({ error: literal('verify_password_error') }),
	object({ error: literal('db_update_error') }),
	object({ error: literal(null), ok: literal(true), data: user_data })
])

export default p
	.input(input_type)
	.output(output_type)
	.mutation(async ({ input, ctx }) => {
		const { mid, email, password, platform } = input

		const res_user = await ctx.$db.select().from(User).where(eq(User.email, email)).get()

		if (!res_user) return { error: 'user_not_exist' }

		const { password_hash, password_salt } = res_user

		const res_verify_password = await verifyPassword(password, password_hash, password_salt)

		if (!res_verify_password) return { error: 'verify_password_error' }

		const { id, name, avatar, paid_plan, paid_expire, paid_renewal, is_infinity, refresh_tokens } = res_user

		const refresh_token = await createToken({ id, mid }, ctx.env.token_secret, true)
		const token = await createToken({ id, mid }, ctx.env.token_secret)

		updateRefreshToken({ refresh_tokens: refresh_tokens!, mid, platform: platform!, refresh_token })

		const [err] = await to(
			ctx.$db
				.update(User)
				.set({ login_at: now(), refresh_tokens: sql`${JSON.stringify(refresh_tokens)}` })
				.where(eq(User.id, id))
		)

		if (err) return { error: 'db_update_error' }

		return {
			error: null,
			ok: true,
			data: {
				id,
				name,
				email,
				avatar,
				paid_plan,
				paid_expire,
				paid_renewal,
				is_infinity,
				refresh_token,
				token
			}
		}
	})
