import { now } from '@server/utils'

import type { Platform } from '@server/types'

interface Args {
	refresh_tokens: Record<string, { refresh_token: string; used_at: number; platform: Platform }>
	mid: string
	platform: Platform
	refresh_token: string
}

export default (args: Args) => {
	const { refresh_tokens, mid, refresh_token, platform } = args

	const keys = Object.keys(refresh_tokens)

	if (keys.length >= 6) {
		const first = keys[0]

		delete refresh_tokens[first]
	}

	refresh_tokens![mid] = { refresh_token, used_at: now(), platform }
}
