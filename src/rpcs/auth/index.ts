import { router } from '@server/utils'

import activate from './activate'
import getCountry from './getCountry'
import getStatus from './getStatus'
import sendVerifyCode from './sendVerifyCode'
import shutdown from './shutdown'
import signin from './signin'
import signout from './signout'
import signup from './signup'

export default router({
	sendVerifyCode,
	signup,
	signin,
	signout,
	activate,
	shutdown,
	getStatus,
	getCountry
})
