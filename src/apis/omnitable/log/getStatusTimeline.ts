import dayjs from 'dayjs'
import { and, between } from 'drizzle-orm'
import { groupBy } from 'lodash-es'
import { array, infer as Infer, literal, number, object, record, string, tuple, union } from 'zod'

import { Log } from '@schema'
import { getTimeRanges } from '@server/utils'

import type { TypedResponse } from 'hono'

const output_type = union([
	object({ error: literal('db_query_error'), message: string() }),
	object({
		data: array(
			object({
				range: tuple([number(), number()]),
				duration: string()
			})
		)
	})
])

type Output = Promise<TypedResponse<Infer<typeof output_type>>>

const args_map = {
	minutes: {
		duration_format: 'HH:mm:ss',
		span_value: 30,
		span_unit: 'minute',
		tick_value: 30,
		tick_unit: 'second'
	},
	hours: {
		duration_format: 'HH:mm',
		span_value: 24,
		span_unit: 'hour',
		tick_value: 30,
		tick_unit: 'minute'
	},
	days: {
		duration_format: 'MM-DD',
		span_value: 30,
		span_unit: 'day',
		tick_value: 12,
		tick_unit: 'hour'
	}
} as const

const handler = async (c: AppContext): Output => {
	const type = (c.req.query('type') || 'hours') as 'minutes' | 'hours' | 'days'
	const timestamp = c.req.query('timestamp')!
	const db = c.var.$db
	const args = args_map[type]
	const ranges = getTimeRanges({ timestamp: Number(timestamp), ...args })

	const data = await Promise.all(
		ranges.map(async range => {
			const [start, end] = range

			const items = await db
				.select({ status: Log.status })
				.from(Log)
				.where(and(between(Log.create_at, start, end)))
				.all()

			const group_items = groupBy(items, item => {
				if (item.status >= 200 && item.status < 300) return '2xx'
				if (item.status >= 400 && item.status < 500) return '4xx'
				if (item.status >= 500 && item.status < 600) return '5xx'
			})

			const target = Object.keys(group_items).reduce(
				(total, key) => {
					total[key] = group_items[key].length

					return total
				},
				{} as Record<string, number>
			)

			return {
				range,
				duration: `${dayjs(start).format(args.duration_format)}`,
				...target
			}
		})
	)

	return c.json({ data })
}

export default {
	handler
}
