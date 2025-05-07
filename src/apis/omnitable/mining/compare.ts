import to from 'await-to-js'
import { and, count, desc, or, sql } from 'drizzle-orm'
import { any, array, infer as Infer, literal, number, object, string, union } from 'zod'

import { zValidator } from '@hono/zod-validator'
import { Mining } from '@schema'
import { filters } from '@server/utils'
import { Mining as MiningSchema } from '@server/zod'

import type { TypedResponse } from 'hono'
import type { GetValidateData } from '@server/types'

const input_type = object({
	sort_params: array(
		object({
			field: MiningSchema.keyof(),
			order: union([literal('asc'), literal('desc')])
		})
	),
	filter_relation: union([literal('and'), literal('or')]),
	filter_params: array(
		object({
			field: string(),
			expression: string(),
			value: any()
		})
	),
	page: number(),
	pagesize: number()
})

const output_type = union([
	object({ error: literal('db_query_error'), message: string() }),
	object({
		data: object({
			items: array(
				MiningSchema.extend({
					earning_7d: number(),
					earning_28d: number()
				})
			),
			page: number(),
			pagesize: number(),
			total: number()
		})
	})
])

type Input = Infer<typeof input_type>
type Output = Promise<TypedResponse<Infer<typeof output_type>>>

const handler = async (c: AppContext<GetValidateData<Input>>): Output => {
	const { sort_params, filter_relation, filter_params, page, pagesize } = c.req.valid('json')
	const db = c.var.$db

	const conditions = filter_params.map(item => {
		return filters[item.expression as keyof typeof filters](item.field, item.value)
	})

	const where = filter_relation === 'and' ? and(...conditions) : or(...conditions)

	const orderBy = sort_params?.length
		? sort_params.map(item => sql`${sql.raw(item.field)} ${sql.raw(item.order.toUpperCase())}`)
		: desc(Mining.create_at)

	const [err, res] = await to(
		db.query.Mining.findMany({
			where,
			orderBy,
			offset: (page - 1) * pagesize,
			limit: pagesize
		})
	)

	const total = await db.select({ count: count() }).from(Mining).where(where).get()

	if (err) return c.json({ error: 'db_query_error', message: err.message })

	const items = [] as Array<any>

	res.forEach((item: any) => {
		item['earning_7d'] = parseFloat(((0.8 + Math.random() * 0.4) * item['earning']).toFixed(2))
		item['earning_28d'] = parseFloat(((0.9 + Math.random() * 0.2) * item['earning']).toFixed(2))

		items.push(item)
	})

	return c.json({
		data: {
			items,
			page,
			pagesize,
			total: total?.count || 0
		}
	})
}

export default {
	validator: zValidator('json', input_type),
	handler
}
