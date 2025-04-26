import { router } from '@server/utils'

import insert from './insert'
import query from './query'
import remove from './remove'
import update from './update'

export default router({
	insert,
	remove,
	update,
	query
})
