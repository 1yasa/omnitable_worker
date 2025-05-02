import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export default sqliteTable(
	'log',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		status: integer('status').notNull(),
		method: text('method').notNull(),
		host: text('host').notNull(),
		pathname: text('pathname').notNull(),
		latency: integer('latency').notNull(),
		region_short: text('region_short').notNull(),
		region_full: text('region_full').notNull(),
		create_at: integer('create_at').$defaultFn(() => new Date().valueOf())
	},
	// sqlite 索引的名称是全局唯一的，即使它们属于不同的表
	table => [index('log_create_at').on(table.create_at)]
)
