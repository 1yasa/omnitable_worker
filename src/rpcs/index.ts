import { router } from '@server/utils'

import admin from './admin'
import auth from './auth'
import user from './user'
import website from './website'

export const routers = router({
	admin,
	website,
	auth,
	user
})

export type Router = typeof routers
