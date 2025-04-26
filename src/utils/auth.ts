import to from 'await-to-js'
import { sign, verify } from 'hono/jwt'

import { now } from './time'

export const createToken = async (
	payload: string | Record<string, any>,
	secret: string,
	is_refresh_token?: boolean
) => {
	return sign(
		{
			...(typeof payload === 'string' ? { id: payload } : payload),
			exp: now() + 60 * 60 * (is_refresh_token ? 360 : 3)
		},
		secret
	)
}

export const verifyToken = async (token: string, secret: string) => {
	return to(verify(token, secret))
}
