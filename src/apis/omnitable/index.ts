import { Hono } from 'hono'

import create from './create'
import { default as remove } from './delete'
import mock from './mock'
import query from './query'
import update from './update'

import type { HonoEnv } from '../../types'

export default new Hono<HonoEnv>()
	.post('/mock', mock.handler)
	.post('/create', create.validator, create.handler)
	.post('/delete/:id', remove.handler)
	.post('/update/:id', update.validator, update.handler)
	.post('/query', query.validator, query.handler)
