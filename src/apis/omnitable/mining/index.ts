import { Hono } from 'hono'

import compare from './compare'
import create from './create'
import mock from './mock'
import query from './query'
import searchFarms from './searchFarms'
import update from './update'

import type { HonoEnv } from '../../../types'

export default new Hono<HonoEnv>()
	.get('/mock', mock.handler)
	.get('/searchFarms', searchFarms.handler)
	.post('/create', create.validator, create.handler)
	.post('/update/:id', update.validator, update.handler)
	.post('/query', query.validator, query.handler)
	.post('/compare', compare.validator, compare.handler)
