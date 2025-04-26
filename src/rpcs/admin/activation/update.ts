import to from 'await-to-js'
import { eq } from 'drizzle-orm'
import { literal, object, string, union } from 'zod'

import { Activation } from '@schema'
import { admin_p, now } from '@server/utils'
import { activation_data_input } from '@server/zod'

const output_type = union([
	object({ error: literal('db_update_error'), info: string() }),
	object({ error: literal(null), ok: literal(true) })
])

export default admin_p
	.input(activation_data_input)
	.output(output_type)
	.mutation(async ({ input, ctx }) => {
		const { code, plan, duration, expire_at, desc } = input

		const [err] = await to(
			ctx.$db
				.update(Activation)
				.set({ plan, duration, expire_at, desc, update_at: now() })
				.where(eq(Activation.code, code!))
		)

		if (err) return { error: 'db_update_error', info: err.message }

		return { error: null, ok: true }
	})
