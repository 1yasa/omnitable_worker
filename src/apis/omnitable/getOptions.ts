import { array, boolean, infer as Infer, literal, number, object, string, union } from 'zod'

import type { TypedResponse } from 'hono'

const output_type = union([
	object({ error: literal('db_update_error'), message: string() }),
	array(
		object({
			label: string(),
			value: union([string(), number(), boolean()]),
			icon: string().optional()
		})
	)
])

type Output = Promise<TypedResponse<Infer<typeof output_type>>>

const handler = async (c: AppContext): Output => {
	const query = c.req.query()

	return c.json([
		{
			label: 'Todo',
			value: 0,
			icon: 'acorn'
		},
		{
			label: 'In-progress',
			value: 1,
			icon: 'timer'
		},
		{
			label: 'Done',
			value: 2,
			icon: 'check-circle'
		},
		{
			label: 'Canceled',
			value: 3,
			icon: 'x-circle'
		}
	])
}

export default {
	handler
}
