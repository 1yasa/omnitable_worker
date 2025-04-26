import to from 'await-to-js'
import { sql } from 'drizzle-orm'
import { eq } from 'drizzle-orm/expressions'
import { xxHash32 } from 'js-xxhash'
import { literal, object, string, union } from 'zod'

import { User } from '@schema'
import { createToken, hashPassword, kv_captcha, now, p, uid } from '@server/utils'
import { user_data } from '@server/zod'

const input_type = object({
	mid: string(),
	name: string(),
	email: string().email(),
	avatar: string(),
	password: string(),
	code: string(),
	platform: union([literal('macos'), literal('windows')]).optional()
})

const output_type = union([
	object({ error: literal('mid_exist') }),
	object({ error: literal('email_exist') }),
	object({ error: literal('verify_code_error') }),
	object({ error: literal('db_insert_error'), info: string() }),
	object({ error: literal(null), ok: literal(true), data: user_data })
])

export default p
	.input(input_type)
	.output(output_type)
	.mutation(async ({ input, ctx }) => {
		const { mid, name, email, avatar, password, code, platform } = input

		const res_captcha = await kv_captcha.get(xxHash32(email).toString(16))

		if (code === res_captcha) {
			await kv_captcha.delete(email)
		} else {
			return { error: 'verify_code_error' }
		}

		const res_exist_mid = await ctx.$db.select().from(User).where(eq(User.mid, mid)).get()

		if (res_exist_mid) return { error: 'mid_exist' }

		const res_exist_email = await ctx.$db.select().from(User).where(eq(User.email, email)).get()

		if (res_exist_email) return { error: 'email_exist' }

		const id = uid()

		const { password_hash, password_salt } = await hashPassword(password)

		const refresh_token = await createToken({ id, mid }, ctx.env.token_secret, true)
		const token = await createToken({ id, mid }, ctx.env.token_secret)

		const refresh_tokens = { [mid]: { refresh_token, used_at: now(), platform } }

		const [err, res] = await to(
			ctx.$db
				.insert(User)
				.values({
					id,
					mid,
					name,
					email,
					avatar,
					password_hash,
					password_salt,
					refresh_tokens: sql`${JSON.stringify(refresh_tokens)}`,
					create_at: now(),
					update_at: now()
				})
				.returning()
				.get()
		)

		if (err) return { error: 'db_insert_error', info: err.message }

		const { paid_plan, paid_expire, paid_renewal, is_infinity } = res

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
