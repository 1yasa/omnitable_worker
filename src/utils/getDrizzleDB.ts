import { drizzle } from 'drizzle-orm/d1'

import { Task } from '@schema'

export default (db: D1Database) => drizzle(db, { schema: { Task } })
