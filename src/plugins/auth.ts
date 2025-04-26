import { verifyToken } from '@server/utils'
import { experimental_standaloneMiddleware, TRPCError } from '@trpc/server'

import type { TrpcContext } from '@server/types'

export default experimental_standaloneMiddleware<{ ctx: TrpcContext }>().create(async args => {
	const { ctx, next } = args
	const authorization = ctx.$c.req.header('Authorization')

	if (!authorization) throw new TRPCError({ code: 'UNAUTHORIZED' })

	const token = authorization.replace('Bearer ', '')

	const [err] = await verifyToken(token, ctx.$c.env.token_secret)

	if (err) throw new TRPCError({ code: 'UNAUTHORIZED' })

	return next({ ctx: { token } })
})
