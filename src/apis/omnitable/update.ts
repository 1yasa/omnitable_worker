import to from 'await-to-js'
import { eq } from 'drizzle-orm'
import { infer as Infer, literal, number, object, string, union } from 'zod'

import { zValidator } from '@hono/zod-validator'
import { Task } from '@schema'
import { task_schema } from '@server/zod'

import type { TypedResponse } from 'hono'
import type { GetValidateData } from '@server/types'

const input_type = task_schema.partial()

const output_type = union([object({ error: literal('db_update_error'), message: string() }), object({ id: number() })])

type Input = Infer<typeof input_type>
type OutputRefreshToken = Promise<TypedResponse<Infer<typeof output_type>>>

const handler = async (c: AppContext<GetValidateData<Input>>): OutputRefreshToken => {
	const id = parseInt(c.req.param('id')!)
	const values = c.req.valid('json')
	const db = c.var.$db

	const [err] = await to(db.update(Task).set(values).where(eq(Task.id, id)))

	if (err) return c.json({ error: 'db_update_error', message: err.message })

	return c.json({ id })
}

export default {
	validator: zValidator('json', input_type),
	handler
}
