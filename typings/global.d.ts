import type { Bindings, DrizzleDB } from '../src/types'
import type { Context } from 'hono'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type { HonoContext } from '../src/types'

declare global {
	type AppContext<T extends {} = {}> = HonoContext<T>
}

export {}
