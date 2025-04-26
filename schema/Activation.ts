import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import User from './User'

export default sqliteTable('activation', {
	code: text('code').primaryKey(),
	plan: text('type', { enum: ['pro', 'max', 'sponsor', 'gold_sponsor', 'team', 'infinity'] }).notNull(),
	duration: integer('duration'),
	expire_at: integer('expire_at').notNull(),
	create_at: integer('create_at').notNull(),
	update_at: integer('update_at').notNull(),
	activate_at: integer('activate_at'),
	desc: text('desc'),
	user_id: text('activation_code').references(() => User.id),
	extends: text('extends', { mode: 'json' }).$type<Record<string, any>>().default(sql`'{}'`)
})
