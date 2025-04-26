import { createSelectSchema } from 'drizzle-zod'
import { infer as Infer } from 'zod'

import { Task } from '@schema'

const schema = createSelectSchema(Task)

export const task_schema = schema.omit({ create_at: true, update_at: true })

export type TaskItem = Infer<typeof schema>

export default schema
