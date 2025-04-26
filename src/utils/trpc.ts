import { ZodError } from 'zod'

import { plugin_auth } from '@server/plugins'
import { initTRPC } from '@trpc/server'

import type { TrpcContext } from '@server/types'
import type { ZodInvalidStringIssue } from 'zod'

const t = initTRPC.context<TrpcContext>().create({
	errorFormatter(args) {
		const { shape, error } = args

		if (error.code === 'BAD_REQUEST' && error.cause instanceof ZodError) {
			return {
				code: shape.code,
				message: '',
				data: (error.cause.issues as Array<ZodInvalidStringIssue>).reduce(
					(total, item) => {
						total[item.path[0] as string] = item.message!

						return total
					},
					{} as Record<string, string>
				)
			}
		}

		return shape
	}
})

export const admin_p = t.procedure.use(plugin_auth)
export const app_p = t.procedure.use(plugin_auth)
export const p = t.procedure

export const router = t.router
