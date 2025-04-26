import to from 'await-to-js'
import { eq } from 'drizzle-orm'
import { literal, object, string, union } from 'zod'

import { AdminUser } from '@schema'
import { p, uid } from '@server/utils'

const input_type = object({
	password: string()
})

const output_type = union([
	object({ error: literal('verify_password_error') }),
	object({ error: literal('user_exist') }),
	object({ error: literal('db_insert_error'), info: string() }),
	object({ error: literal(null), ok: literal(true) })
])

const email = 'openages@gmail.com'
const password = 'qq+x1145731254'

export default p
	.input(input_type)
	.output(output_type)
	.mutation(async ({ input, ctx }) => {
		const { password } = input

		if (password !== ctx.env.admin_password) return { error: 'verify_password_error' }

		const res_user = await ctx.$db.query.AdminUser.findFirst({ where: eq(AdminUser.email, email) })

		if (res_user) return { error: 'user_exist' }

		const [err] = await to(ctx.$db.insert(AdminUser).values({ id: uid(), email, password, role: 'admin' }))

		if (err) return { error: 'db_insert_error', info: err.message }

		return { error: null, ok: true }
	})
