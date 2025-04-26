import to from 'await-to-js'
import { eq } from 'drizzle-orm/expressions'
import { literal, object, string, union } from 'zod'

import { AdminUser } from '@schema'
import { createToken, now, p } from '@server/utils'
import { admin_user_data } from '@server/zod'

const input_type = object({
	email: string(),
	password: string()
})

const output_type = union([
	object({ error: literal('user_not_exist') }),
	object({ error: literal('verify_password_error') }),
	object({ error: literal('db_update_error') }),
	object({ error: literal(null), ok: literal(true), data: admin_user_data })
])

export default p
	.input(input_type)
	.output(output_type)
	.mutation(async ({ input, ctx }) => {
		const { email, password } = input

		const res_user = await ctx.$db.select().from(AdminUser).where(eq(AdminUser.email, email)).get()

		if (!res_user) return { error: 'user_not_exist' }

		const { password: db_password } = res_user

		if (password !== db_password) return { error: 'verify_password_error' }

		const { id, name } = res_user

		const token = await createToken(id, ctx.env.token_secret)

		const [err] = await to(ctx.$db.update(AdminUser).set({ login_at: now() }).where(eq(AdminUser.id, id)))

		if (err) return { error: 'db_update_error' }

		return {
			error: null,
			ok: true,
			data: { id, name, email, token }
		}
	})
