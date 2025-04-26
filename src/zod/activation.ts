import { number, object, tuple } from 'zod'

import { Activation } from './schemas'

export const activation_data_input = Activation.pick({
	plan: true,
	expire_at: true
}).merge(
	Activation.pick({
		code: true,
		duration: true,
		desc: true,
		user_id: true
	}).partial()
)

export const activation_query_input = Activation.pick({
	code: true,
	plan: true,
	duration: true,
	desc: true,
	user_id: true
})
	.merge(
		object({
			create_at: tuple([number(), number()]),
			activate_at: tuple([number(), number()]),
			page: number(),
			pagesize: number()
		})
	)
	.partial()
