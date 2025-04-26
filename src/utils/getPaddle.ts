import { Environment, Paddle } from '@paddle/paddle-node-sdk'

export default (c: AppContext) =>
	new Paddle(c.env.paddle_api_key, {
		environment: process.env.SANDBOX ? Environment.sandbox : Environment.production
	})
