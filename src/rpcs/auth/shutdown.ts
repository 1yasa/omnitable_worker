import to from 'await-to-js'
import { eq } from 'drizzle-orm/expressions'
import { literal, object, string, union } from 'zod'

import { User } from '@schema'
import { app_p } from '@server/utils'

const input_type = object({
	id: string()
})

const output_type = union([
	object({ error: literal('user_not_exist') }),
	object({ error: literal('db_delete_error') }),
	object({ error: literal(null), ok: literal(true) })
])

export default app_p
	.input(input_type)
	.output(output_type)
	.mutation(async ({ input, ctx }) => {
		const { id } = input

		const res_user = await ctx.$db.select().from(User).where(eq(User.id, id)).get()

		if (!res_user) return { error: 'user_not_exist' }

		const [err] = await to(ctx.$db.delete(User).where(eq(User.id, id)))

		if (err) return { error: 'db_delete_error' }

		return {
			error: null,
			ok: true
		}
	})
