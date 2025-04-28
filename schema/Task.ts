import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export default sqliteTable(
	'task',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		title: text('title').notNull(),
		status: integer('status').default(0),
		priority: integer('priority').default(0),
		estimated_hours: integer('estimated_hours').default(3),
		deadline_time: integer('deadline_time'),
		labels: text('labels', { mode: 'json' }).$type<Array<string>>().default(sql`'[]'`),
		miner: text('miner'),
		create_at: integer('create_at').$defaultFn(() => new Date().valueOf()),
		update_at: integer('update_at').$onUpdateFn(() => new Date().valueOf())
	},
	table => [
		index('deadline_time').on(table.deadline_time),
		index('create_at').on(table.create_at),
		index('update_at').on(table.update_at)
	]
)
