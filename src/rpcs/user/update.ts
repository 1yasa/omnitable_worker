import { eq } from 'drizzle-orm/expressions'
import { omit } from 'lodash-es'
import { literal, object, string, union } from 'zod'

import { User } from '@schema'
import { now, p, verifyToken } from '@server/utils'

const input_type = object({
	id: string(),
	name: string().optional(),
	avatar: string().optional()
})

const output_type = union([
	object({ error: literal('not_login') }),
	object({ error: literal('token_error') }),
	object({ error: literal('user_not_exist') }),
	object({ error: literal(null), ok: literal(true), data: input_type.omit({ id: true }) })
])

export default p
	.input(input_type)
	.output(output_type)
	.mutation(async ({ input, ctx }) => {
		const { id } = input
		const authorization = ctx.$c.req.header('Authorization')

		if (!authorization) return { error: 'not_login' }

		const token = authorization.replace('Bearer ', '')

		const [err_token] = await verifyToken(token, ctx.env.token_secret)

		if (err_token) return { error: 'token_error' }

		const res_user = await ctx.$db.select().from(User).where(eq(User.id, id)).get()

		if (!res_user) return { error: 'user_not_exist' }

		const data = omit(input, 'id')

		await ctx.$db
			.update(User)
			.set({ ...data, update_at: now() })
			.where(eq(User.id, id))

		return { error: null, ok: true, data }
	})
