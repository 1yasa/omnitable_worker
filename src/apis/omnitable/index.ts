import { Hono } from 'hono'

import create from './create'
import { default as remove } from './delete'
import getOptions from './getOptions'
import mock from './mock'
import query from './query'
import searchOptions from './searchOptions'
import update from './update'

import type { HonoEnv } from '../../types'

export default new Hono<HonoEnv>()
	.get('/mock', mock.handler)
	.get('/getOptions', getOptions.handler)
	.get('/searchOptions', searchOptions.handler)
	.post('/create', create.validator, create.handler)
	.post('/delete/:id', remove.handler)
	.post('/update/:id', update.validator, update.handler)
	.post('/query', query.validator, query.handler)
