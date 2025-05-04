import { Hono } from 'hono'

import create from './create'
import getStatusTimeline from './getStatusTimeline'
import mock from './mock'
import query from './query'

import type { HonoEnv } from '../../../types'

export default new Hono<HonoEnv>()
	.get('/mock', mock.handler)
	.get('/getStatusTimeline', getStatusTimeline.handler)
	.post('/create', create.validator, create.handler)
	.post('/query', query.validator, query.handler)
