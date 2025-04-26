import { AppStoreServerAPI, Environment } from 'app-store-server-api'
import { getContext } from 'hono/context-storage'

import type { HonoEnv } from '@server/types'

export default () => {
	const { apple_bundle_id, apple_issure_id, apple_key_id, apple_key } = getContext<HonoEnv>().env

	return new AppStoreServerAPI(
		apple_key,
		apple_key_id,
		apple_issure_id,
		apple_bundle_id,
		process.env.SANDBOX ? Environment.Sandbox : Environment.Production
	)
}
