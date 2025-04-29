import { createSelectSchema } from 'drizzle-zod'
import { infer as Infer } from 'zod'

import { Mining } from '@schema'

const schema = createSelectSchema(Mining)

export const mining_schema = schema.omit({ create_at: true, update_at: true })

export type MiningItem = Infer<typeof schema>

export default schema
