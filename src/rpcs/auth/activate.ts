import to from 'await-to-js'
import { eq } from 'drizzle-orm/expressions'
import { literal, object, string, union } from 'zod'

import { Activation, User } from '@schema'
import { app_p, now, verifyToken } from '@server/utils'
import { user_data } from '@server/zod'

const input_type = object({
	id: string(),
	activation_code: string(),
	refresh_token: string()
})

const output_type = union([
	object({ error: literal('refresh_token_error') }),
	object({ error: literal('activation_code_not_exist') }),
	object({ error: literal('activation_code_expired') }),
	object({ error: literal('activation_code_user_not_match') }),
	object({ error: literal('activation_code_used') }),
	object({ error: literal('user_not_exist') }),
	object({ error: literal('db_update_error'), info: string() }),
	object({ error: literal(null), ok: literal(true), data: user_data })
])

export default app_p
	.input(input_type)
	.output(output_type)
	.mutation(async ({ input, ctx }) => {
		const { id, activation_code, refresh_token } = input
		const [err_refresh_token] = await verifyToken(refresh_token, ctx.env.token_secret)

		if (err_refresh_token) return { error: 'refresh_token_error' }

		const res_activation = await ctx.$db
			.select()
			.from(Activation)
			.where(eq(Activation.code, activation_code))
			.get()

		if (!res_activation) return { error: 'activation_code_not_exist' }

		const { plan, duration, expire_at, activate_at, user_id } = res_activation

		if (now() >= expire_at) return { error: 'activation_code_expired' }

		if (user_id && id !== user_id) return { error: 'activation_code_user_not_match' }
		if (activate_at) return { error: 'activation_code_used' }

		const res_user = await ctx.$db.select().from(User).where(eq(User.id, id)).get()

		if (!res_user) return { error: 'user_not_exist' }

		let data

		if (plan === 'infinity') {
			data = { is_infinity: true, activation_code }
		} else {
			data = { paid_plan: plan, paid_expire: now() + duration!, activation_code }
		}

		const [err, res] = await to(ctx.$db.update(User).set(data).where(eq(User.id, id)).returning().get())

		if (err) return { error: 'db_update_error', info: err.message }

		const { name, email, avatar, paid_plan, paid_expire, is_infinity } = res

		await ctx.$db
			.update(Activation)
			.set({ user_id: id, activate_at: now() })
			.where(eq(Activation.code, activation_code))

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
				is_infinity,
				refresh_token,
				token: ctx.token
			}
		}
	})
