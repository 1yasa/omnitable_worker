import { createMiddleware } from 'hono/factory'

export default createMiddleware(async (c: AppContext, next) => {
	await next()

	const { status, statusText, headers } = c.res
	const data = c.res.body ? await c.res.json() : null

	c.res = new Response(
		JSON.stringify({
			code: status,
			message: statusText,
			data
		}),
		{
			status,
			headers
		}
	)
})
