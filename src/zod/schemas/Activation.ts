import { createSelectSchema } from 'drizzle-zod'
import { infer as Infer } from 'zod'

import { Activation } from '@schema'

const schema = createSelectSchema(Activation)

export const activation_schema = schema.omit({ extends: true })

export type ActivationSchema = Infer<typeof activation_schema>

export default schema
