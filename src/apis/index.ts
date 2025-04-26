import { Hono } from 'hono'

import { useDatabase } from '@server/middlewares'

import omnitable from './omnitable'

// import admin from './admin'
// import paddle from './paddle'
// import refreshToken from './refreshToken'
// import test from './test'
// import toMarkdown from './toMarkdown'

import type { HonoEnv } from '../types'

const apis = new Hono<HonoEnv>().use(useDatabase).route('/omnitable', omnitable)
// .route('/admin', admin)
// .get('/test', test.handler)
// .post('/refreshToken', refreshToken.validator, refreshToken.handler)
// .post('/paddle', paddle.handler)
// .post('/toMarkdown', toMarkdown.handler)

export type Api = typeof apis

export default apis
