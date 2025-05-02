import { createSelectSchema } from 'drizzle-zod'
import { infer as Infer } from 'zod'

import { Log } from '@schema'

const schema = createSelectSchema(Log)

export const log_schema = schema.omit({ create_at: true })

export type LogItem = Infer<typeof schema>

export default schema
