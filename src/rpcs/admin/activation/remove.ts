import to from 'await-to-js'
import { eq } from 'drizzle-orm'
import { literal, object, string, union } from 'zod'

import { Activation } from '@schema'
import { admin_p } from '@server/utils'

const input_type = object({
	code: string()
})

const output_type = union([
	object({ error: literal('db_delete_error'), info: string() }),
	object({ error: literal(null), ok: literal(true) })
])

export default admin_p
	.input(input_type)
	.output(output_type)
	.mutation(async ({ input, ctx }) => {
		const { code } = input

		const [err] = await to(ctx.$db.delete(Activation).where(eq(Activation.code, code)))

		if (err) return { error: 'db_delete_error', info: err.message }

		return { error: null, ok: true }
	})
