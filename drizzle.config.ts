import { defineConfig } from 'drizzle-kit'
import fs from 'fs'
import path from 'path'

import type { Config } from 'drizzle-kit'

const { NODE_ENV, GEN,  cf_account_id, cf_database_id, cf_d1_token } = process.env

let db_config = null as unknown as Partial<Config>

if (!GEN) {
	const base = path.resolve('.wrangler')
	const db_file = fs.readdirSync(base, { encoding: 'utf-8', recursive: true }).find(f => f.endsWith('.sqlite'))!
	const db_path = path.resolve(base, db_file)

	if (NODE_ENV === 'production') {
		db_config = {
			driver: 'd1-http',
			dbCredentials: {
				accountId: cf_account_id!,
				databaseId: cf_database_id!,
				token: cf_d1_token!
			}
		} as Config
	} else {
		db_config = {
			dbCredentials: {
				url: db_path
			}
		} as Config
	}
}

export default defineConfig({
	out: 'drizzle',
	schema: './schema/index.ts',
	dialect: 'sqlite',

	...db_config
})
