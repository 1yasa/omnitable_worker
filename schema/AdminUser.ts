import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export default sqliteTable('admin_user', {
	id: text('id').primaryKey(),
	name: text('name'),
	email: text('email').notNull(),
	password: text('password').notNull(),
	role: text('role', { enum: ['admin', 'stuff'] }).notNull(),
	login_at: integer('login_at'),
	extends: text('extends', { mode: 'json' }).$type<Record<string, any>>().default(sql`'{}'`)
})
