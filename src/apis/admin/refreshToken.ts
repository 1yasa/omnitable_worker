import to from 'await-to-js'
import { eq } from 'drizzle-orm/expressions'
import { infer as Infer, literal, object, string, union } from 'zod'

import { zValidator } from '@hono/zod-validator'
import { AdminUser } from '@schema'
import { createToken, now, verifyToken } from '@server/utils'

import type { TypedResponse } from 'hono'
import type { GetValidateData } from '@server/types'

const input_type = object({
	id: string(),
	token: string()
})

const output_type = union([
	object({ error: literal('input_type_error') }),
	object({ error: literal('token_verify_error') }),
	object({ error: literal('user_not_exist') }),
	object({ error: literal('db_update_error') }),
	object({ error: literal(null), ok: literal(true), data: string() })
])

type Input = Infer<typeof input_type>
type OutputRefreshToken = Promise<TypedResponse<Infer<typeof output_type>>>

const handler = async (c: AppContext<GetValidateData<Input>>): OutputRefreshToken => {
	const { id, token: user_token } = c.req.valid('json')

	const [err_verify_token] = await verifyToken(user_token, c.env.token_secret)

	if (err_verify_token) return c.json({ error: 'token_verify_error' })

	const res_user = await c.var.$db.select().from(AdminUser).where(eq(AdminUser.id, id)).get()

	if (!res_user) return c.json({ error: 'user_not_exist' })

	const token = await createToken(id, c.env.token_secret)

	const [err] = await to(c.var.$db.update(AdminUser).set({ login_at: now() }).where(eq(AdminUser.id, id)))

	if (err) return c.json({ error: 'db_update_error' })

	return c.json({ error: null, ok: true, data: token })
}

export default {
	validator: zValidator('json', input_type),
	handler
}
