import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export default sqliteTable(
	'user',
	{
		id: text('id').primaryKey(),
		mid: text('mid'),
		name: text('name'),
		email: text('email').notNull(),
		password_hash: text('password_hash').notNull(),
		password_salt: text('password_salt').notNull(),
		avatar: text('avatar'),
		paid_plan: text('paid_plan', { enum: ['free', 'pro', 'max', 'sponsor', 'gold_sponsor', 'team'] })
			.notNull()
			.default('free'),
		paid_expire: integer('paid_expire'),
		paid_renewal: integer('paid_renewal', { mode: 'boolean' }),
		refresh_tokens: text('mids', { mode: 'json' })
			.$type<Record<string, { refresh_token: string; used_at: number; platform: 'macos' | 'windows' }>>()
			.default(sql`'{}'`),
		is_infinity: integer('is_infinity', { mode: 'boolean' }).notNull().default(false),
		login_at: integer('login_at'),
		create_at: integer('create_at').notNull(),
		update_at: integer('update_at').notNull(),
		activation_code: text('activation_code'),
		tid: text('tid'),
		receipt: text('receipt', { mode: 'json' }).$type<{ receipt_url: string }>().default(sql`'{}'`),
		extends: text('extends', { mode: 'json' }).$type<Record<string, any>>().default(sql`'{}'`)
	},
	table => ({
		mid_index: uniqueIndex('mid_index').on(table.mid),
		email_index: uniqueIndex('email_index').on(table.email),
		paid_plan_index: index('paid_plan_index').on(table.paid_plan),
		is_infinity_index: index('is_infinity_index').on(table.is_infinity),
		tid_index: uniqueIndex('tid_index').on(table.tid),
		create_at_index: index('create_at_index').on(table.create_at)
	})
)
