import to from 'await-to-js'
import { infer as Infer, literal, number, object, string, union } from 'zod'

import { zValidator } from '@hono/zod-validator'
import { Task } from '@schema'
import { task_schema } from '@server/zod'

import type { TypedResponse } from 'hono'
import type { GetValidateData } from '@server/types'

const input_type = task_schema.omit({ id: true }).partial({
	status: true,
	priority: true,
	estimated_hours: true,
	deadline_time: true,
	labels: true
})

const output_type = union([object({ error: literal('db_create_error'), message: string() }), object({ id: number() })])

type Input = Infer<typeof input_type>
type OutputRefreshToken = Promise<TypedResponse<Infer<typeof output_type>>>

const handler = async (c: AppContext<GetValidateData<Input>>): OutputRefreshToken => {
	const values = c.req.valid('json')
	const db = c.var.$db

	const [err, res] = await to(db.insert(Task).values(values).returning())

	if (err) return c.json({ error: 'db_create_error', message: err.message })

	return c.json({ id: res[0].id })
}

export default {
	validator: zValidator('json', input_type),
	handler
}
