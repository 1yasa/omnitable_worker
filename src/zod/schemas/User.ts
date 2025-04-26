import { createSelectSchema } from 'drizzle-zod'
import { infer as Infer } from 'zod'

import { User } from '@schema'

const schema = createSelectSchema(User)

export const user_schema = schema.omit({ receipt: true, extends: true, refresh_tokens: true })

export type UserSchema = Infer<typeof user_schema>

export default schema
