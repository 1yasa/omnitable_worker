import { createMiddleware } from 'hono/factory'

import { getDrizzleDB } from '@server/utils'

export default createMiddleware(async (c: AppContext, next) => {
	c.set('$db', getDrizzleDB(c.env.db))

	await next()
})
