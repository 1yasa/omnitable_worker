import { Hono } from 'hono'

import refreshToken from './refreshToken'

import type { HonoEnv } from '../../types'

export default new Hono<HonoEnv>().post('/refreshToken', refreshToken.validator, refreshToken.handler)
