import { getContext } from 'hono/context-storage'
import { Resend } from 'resend'

import type { HonoEnv } from '@server/types'

export default () => {
	const { resend_key } = getContext<HonoEnv>().env

	return new Resend(resend_key)
}
