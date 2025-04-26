import to from 'await-to-js'
import { array, infer as Infer, literal, number, object, string, union } from 'zod'

import { Task } from '@schema'

import data from './_data'

import type { TypedResponse } from 'hono'

const output_type = union([
	object({ error: literal('db_create_error'), message: string() }),
	object({ ids: array(number()) })
])

type OutputRefreshToken = Promise<TypedResponse<Infer<typeof output_type>>>

const handler = async (c: AppContext): OutputRefreshToken => {
	const db = c.var.$db

	const [err, res] = await to(
		db
			.insert(Task)
			// >14会报错 D1_ERROR: too many SQL variables at offset 639: SQLITE_ERROR
			.values(data.sort(() => Math.random() - 0.5).slice(0, 14))
			.returning()
	)

	if (err) return c.json({ error: 'db_create_error', message: err.message })

	return c.json({ ids: res.map(item => item.id) })
}

export default {
	handler
}
