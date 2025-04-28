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
	const keyword = c.req.query('keyword')!

	if (!keyword) return c.json([])

	const items = [
		{ label: 'Virginia-A200', value: 'Virginia-A200' },
		{ label: 'Frankfurt-B300', value: 'Frankfurt-B300' },
		{ label: 'Tokyo-C400', value: 'Tokyo-C400' },
		{ label: 'Singapore-D500', value: 'Singapore-D500' },
		{ label: 'Sydney-E600', value: 'Sydney-E600' },
		{ label: 'London-F700', value: 'London-F700' },
		{ label: 'Mumbai-G800', value: 'Mumbai-G800' },
		{ label: 'SaoPaulo-H900', value: 'SaoPaulo-H900' },
		{ label: 'Seoul-I1000', value: 'Seoul-I1000' },
		{ label: 'Dubai-J2000', value: 'Dubai-J2000' }
	]

	const targets = items.filter(
		item =>
			item.label.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
			item.value.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
	)

	return c.json(targets)
}

export default {
	handler
}
