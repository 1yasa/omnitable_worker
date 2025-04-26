import { sql } from 'drizzle-orm'
import { eq } from 'drizzle-orm/expressions'
import { literal, object, string, union } from 'zod'

import { User } from '@schema'
import { app_p } from '@server/utils'

const input_type = object({
	mid: string(),
	id: string()
})

const output_type = union([
	object({ error: literal('user_not_exist') }),
	object({ error: literal(null), ok: literal(true) })
])

export default app_p
	.input(input_type)
	.output(output_type)
	.mutation(async ({ input, ctx }) => {
		const { mid, id } = input

		const res_user = await ctx.$db.select().from(User).where(eq(User.id, id)).get()

		if (!res_user) return { error: 'user_not_exist' }

		const { refresh_tokens } = res_user

		delete refresh_tokens![mid]

		await ctx.$db
			.update(User)
			.set({ refresh_tokens: sql`${JSON.stringify(refresh_tokens)}` })
			.where(eq(User.id, id))

		return {
			error: null,
			ok: true
		}
	})
