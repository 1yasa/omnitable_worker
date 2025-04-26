import { object, string } from 'zod'

import { User } from './schemas'

export const user_data = User.pick({
	id: true,
	name: true,
	email: true,
	avatar: true,
	paid_plan: true,
	paid_expire: true,
	is_infinity: true
}).merge(
	object({
		refresh_token: string(),
		token: string()
	})
)
