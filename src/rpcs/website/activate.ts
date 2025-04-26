import to from 'await-to-js'
import { eq } from 'drizzle-orm/expressions'
import { literal, object, string, union } from 'zod'

import { Activation, User } from '@schema'
import { now, p } from '@server/utils'

const input_type = object({
	id: string(),
	activation_code: string()
})

const output_type = union([
	object({ error: literal('refresh_token_error') }),
	object({ error: literal('activation_code_not_exist') }),
	object({ error: literal('activation_code_expired') }),
	object({ error: literal('activation_code_user_not_match') }),
	object({ error: literal('activation_code_used') }),
	object({ error: literal('user_not_exist') }),
	object({ error: literal('db_update_error'), info: string() }),
	object({ error: literal(null), ok: literal(true) })
])

export default p
	.input(input_type)
	.output(output_type)
	.mutation(async ({ input, ctx }) => {
		const { id, activation_code } = input

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

		const [err] = await to(ctx.$db.update(User).set(data).where(eq(User.id, id)).returning().get())

		if (err) return { error: 'db_update_error', info: err.message }

		await ctx.$db
			.update(Activation)
			.set({ user_id: id, activate_at: now() })
			.where(eq(Activation.code, activation_code))

		return { error: null, ok: true }
	})
