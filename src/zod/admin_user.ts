import { object, string } from 'zod'

import { AdminUser } from './schemas'

export const admin_user_data = AdminUser.pick({
	id: true,
	name: true,
	email: true
}).merge(
	object({
		token: string()
	})
)
