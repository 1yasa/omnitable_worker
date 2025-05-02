import { drizzle } from 'drizzle-orm/d1'

import { Log, Mining, Task } from '@schema'

export default (db: D1Database) => drizzle(db, { schema: { Task, Mining, Log } })
