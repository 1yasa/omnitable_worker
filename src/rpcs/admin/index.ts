import { router } from '@server/utils'

import activation from './activation'
import insertDefault from './insertDefault'
import signin from './signin'

export default router({
	insertDefault,
	signin,
	activation
})
