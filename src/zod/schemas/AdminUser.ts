import { createSelectSchema } from 'drizzle-zod'
import { infer as Infer } from 'zod'

import { AdminUser } from '@schema'

const schema = createSelectSchema(AdminUser)

export const admin_user_schema = schema.omit({ extends: true })

export type AdminUserSchema = Infer<typeof admin_user_schema>

export default schema
