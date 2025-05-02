import { Hono } from 'hono'

import create from './create'
import mock from './mock'
import query from './query'

import type { HonoEnv } from '../../../types'

export default new Hono<HonoEnv>()
	.get('/mock', mock.handler)
	.post('/create', create.validator, create.handler)
	.post('/query', query.validator, query.handler)
