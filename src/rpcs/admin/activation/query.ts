import to from 'await-to-js'
import { count, desc as Desc } from 'drizzle-orm'
import { array, literal, number, object, string, union } from 'zod'

import { Activation } from '@schema'
import { admin_p, getQueryConditions } from '@server/utils'
import { activation_query_input, activation_schema } from '@server/zod'

const output_type = union([
	object({ error: literal('db_find_error'), info: string() }),
	object({ error: literal(null), ok: literal(true), data: array(activation_schema), total: number() })
])

export default admin_p
	.input(activation_query_input)
	.output(output_type)
	.mutation(async ({ input, ctx }) => {
		const { code, plan, duration, desc, user_id, create_at, activate_at, page = 1, pagesize = 12 } = input

		const sql = getQueryConditions(
			Activation,
			[
				{ type: 'eq', key: 'code', value: code },
				{ type: 'eq', key: 'user_id', value: user_id },
				{ type: 'like', key: 'desc', value: desc },
				{ type: 'eq', key: 'plan', value: plan },
				{ type: 'eq', key: 'duration', value: duration },
				{ type: 'between', key: 'create_at', value: create_at },
				{ type: 'between', key: 'activate_at', value: activate_at }
			],
			'and'
		)

		const [err, res] = await to(
			ctx.$db.query.Activation.findMany({
				where: sql,
				orderBy: [Desc(Activation.create_at)],
				offset: (page - 1) * pagesize,
				limit: pagesize
			})
		)

		const total = await ctx.$db.select({ count: count() }).from(Activation).where(sql).get()

		if (err) return { error: 'db_find_error', info: err.message }

		return { error: null, ok: true, data: res, total: total?.count || 0 }
	})
