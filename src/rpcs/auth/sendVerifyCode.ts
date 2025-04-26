import to from 'await-to-js'
import { xxHash32 } from 'js-xxhash'
import { literal, object, string, union } from 'zod'

import { getResend, getVerifyCode, kv_captcha, p } from '@server/utils'

const input_type = object({
	mid: string(),
	email: string().email()
})

const output_type = union([
	object({ error: literal('send_verify_code_exsit') }),
	object({ error: literal('send_verify_code_error') }),
	object({ error: literal(null), ok: literal(true) })
])

export default p
	.input(input_type)
	.output(output_type)
	.mutation(async ({ input, ctx }) => {
		const { mid, email } = input
		const resend = getResend()
		const from = 'if@openages.com'
		const code = getVerifyCode()
		const ip = ctx.$c.req.header('cf-connecting-ip')!

		const exist_mid = await kv_captcha.get(mid)

		if (exist_mid) return { error: 'send_verify_code_exsit' }

		const exist_ip = await kv_captcha.get<number>(ip)

		if (exist_ip) {
			if (exist_ip > 6) {
				return { error: 'send_verify_code_exsit' }
			} else {
				await kv_captcha.set(ip, exist_ip + 1)
			}
		}

		const [err] = await to(
			resend.emails.send({
				from,
				to: email,
				subject: `${from}: ${email} Verify Code`,
				text: `Your verify code is: ${code}`
			})
		)

		if (err) return { error: 'send_verify_code_error' }

		await kv_captcha.set(xxHash32(email).toString(16), code)
		await kv_captcha.set(mid, 1)
		await kv_captcha.set(ip, 1)

		return { error: null, ok: true }
	})
