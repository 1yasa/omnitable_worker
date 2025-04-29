import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export default sqliteTable(
	'mining',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		period: integer('period').$defaultFn(() => new Date().valueOf()),
		farm: text('farm').notNull(),
		pool: text('pool').notNull(),
		earning: real('earning').default(0),
		hashrate: real('hashrate').default(0),
		create_at: integer('create_at').$defaultFn(() => new Date().valueOf()),
		update_at: integer('update_at').$onUpdateFn(() => new Date().valueOf())
	},
	table => [index('period').on(table.period), index('farm').on(table.farm), index('pool').on(table.pool)]
)
