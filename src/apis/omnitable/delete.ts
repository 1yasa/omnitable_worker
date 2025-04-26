import to from 'await-to-js'
import { eq } from 'drizzle-orm'
import { infer as Infer, literal, number, object, string, union } from 'zod'

import { Task } from '@schema'

import type { TypedResponse } from 'hono'

const output_type = union([object({ error: literal('db_delete_error'), message: string() }), object({ id: number() })])

type OutputRefreshToken = Promise<TypedResponse<Infer<typeof output_type>>>

const handler = async (c: AppContext): OutputRefreshToken => {
	const id = parseInt(c.req.param('id')!)
	const db = c.var.$db

	const [err] = await to(db.delete(Task).where(eq(Task.id, id)))

	if (err) return c.json({ error: 'db_delete_error', message: err.message })

	return c.json({ id })
}

export default {
	handler
}
