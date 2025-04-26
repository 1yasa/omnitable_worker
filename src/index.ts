import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { cors } from 'hono/cors'

import { cloudflareRateLimiter } from '@hono-rate-limiter/cloudflare'
import { trpcServer } from '@hono/trpc-server'
import { routers } from '@server/rpcs'

import apis from './apis'
import { getDrizzleDB } from './utils'

import type { HonoEnv } from './types'

const app = new Hono<HonoEnv>()

app.use(contextStorage())

app.use(
	'*',
	cors({
		origin: '*',
		allowHeaders: ['Content-Type', 'Authorization'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true
	})
)

// app.use(
// 	cloudflareRateLimiter<HonoEnv>({
// 		rateLimitBinding: c => c.env.RATE_LIMITER,
// 		keyGenerator: c => c.req.header('cf-connecting-ip') ?? ''
// 	})
// )

app.route('/api', apis)

// app.use(
// 	'/trpc/*',
// 	trpcServer({
// 		router: routers,
// 		createContext: (_, c: AppContext) => ({
// 			$c: c,
// 			$db: getDrizzleDB(c.env.db)
// 		})
// 	})
// )

export default app
