import { infer as Infer, number, object } from 'zod'

import { now } from '@server/utils'

import type { TypedResponse } from 'hono'

const output_type = object({ timestamp: number() })

type OutputRefreshToken = Promise<TypedResponse<Infer<typeof output_type>>>

const handler = async (c: AppContext): OutputRefreshToken => {
	return c.json({ timestamp: now() }, 200)
}

export default {
	handler
}
