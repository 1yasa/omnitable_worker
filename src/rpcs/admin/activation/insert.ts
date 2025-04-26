import to from 'await-to-js'
import { literal, object, string, union } from 'zod'

import { Activation } from '@schema'
import { admin_p, getId, now } from '@server/utils'
import { activation_data_input } from '@server/zod'

const output_type = union([
	object({ error: literal('db_insert_error'), info: string() }),
	object({ error: literal(null), ok: literal(true) })
])

export default admin_p
	.input(activation_data_input)
	.output(output_type)
	.mutation(async ({ input, ctx }) => {
		const { plan, duration, expire_at, desc, user_id } = input

		const [err] = await to(
			ctx.$db.insert(Activation).values({
				code: getId(12).toUpperCase(),
				plan,
				duration,
				expire_at,
				desc,
				user_id,
				create_at: now(),
				update_at: now()
			})
		)

		if (err) return { error: 'db_insert_error', info: err.message }

		return { error: null, ok: true }
	})
