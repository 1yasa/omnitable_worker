import { Mining, Task } from '@schema'

import type { Context } from 'hono'

import type { DrizzleD1Database } from 'drizzle-orm/d1'

export type DrizzleDB = DrizzleD1Database<{
	Task: typeof Task
	Mining: typeof Mining
}>

export interface Bindings {
	ai: Ai
	db: D1Database
	RATE_LIMITER: RateLimit
	client_secret_key: string
	admin_password: string
	token_secret: string
	resend_key: string
	paddle_api_key: string
	paddle_webhook_secret: string
}

export interface TrpcContext {
	$c: AppContext
	$db: DrizzleDB
	env: Bindings
}

export interface HonoEnv {
	Bindings: Bindings
	Variables: { $db: DrizzleDB; rateLimit: boolean }
	[key: string]: any
}

export type HonoContext<T extends {} = {}> = Context<HonoEnv, string, T>

export type GetValidateData<T extends {}> = {
	in: {
		json: T
	}
	out: {
		json: T
	}
}

export type Platform = 'macos' | 'windows'
