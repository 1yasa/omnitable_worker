import to from 'await-to-js'
import { enc, AES } from 'crypto-js'
import dayjs from 'dayjs'
import { eq } from 'drizzle-orm/expressions'
import { compressToUTF16 } from 'lz-string'
import ntry from 'nice-try'
import { infer as Infer, literal, object, string, union } from 'zod'

import { User } from '@schema'
import { app_p, getPaddle, now, now_ms } from '@server/utils'
import { getUser, setPaidPlan } from '@server/utils/user'
import { user_schema } from '@server/zod'

import type { UserSchema } from '@server/zod'
import type { UserTypes } from '@server/types/user'

const data_schema = user_schema.pick({ paid_plan: true, paid_expire: true }).partial()

const input_type = object({
	key: string()
})

const output_type = union([
	object({ error: literal('validate_error') }),
	object({ error: literal('user_not_exist') }),
	object({ error: literal(null), data: string() })
])

const encryptData = (data: any, refresh_token: string) => {
	return AES.encrypt(compressToUTF16(JSON.stringify(data)), refresh_token).toString()
}

export default app_p
	.input(input_type)
	.output(output_type)
	.mutation(async ({ input, ctx }) => {
		const { key } = input
		const paddle = getPaddle(ctx.$c)

		const decrypt_key = ntry(() => AES.decrypt(key, ctx.env.client_secret_key).toString(enc.Utf8))

		if (!decrypt_key) return { error: 'validate_error' }

		const user_data = ntry(() => JSON.parse(decrypt_key)) as { user_id: string; refresh_token: string }

		if (!user_data) return { error: 'validate_error' }

		const { user_id, refresh_token } = user_data

		const user = await getUser(ctx.$db, user_id)

		const free_user = {
			error: null,
			data: encryptData({ paid_plan: 'free', paid_expire: null, is_infinity: false }, refresh_token)
		}

		if (!user) return { error: 'user_not_exist' }

		if (user.is_infinity) {
			return {
				error: null,
				data: encryptData({ is_infinity: true }, refresh_token)
			}
		}

		if (!user.tid) return free_user

		const [err_subscription, subscription] = await to(paddle.subscriptions.get(user.tid))

		if (err_subscription) {
			await setPaidPlan(ctx.$db, user_id, null)

			return free_user
		}

		const expires_date = dayjs(subscription.currentBillingPeriod?.endsAt!).valueOf()
		const custom_data = subscription.customData as UserTypes.CustomData

		if (!expires_date || expires_date < now_ms()) {
			await setPaidPlan(ctx.$db, user_id, null)

			return free_user
		}

		const { paid_plan, paid_expire } = user
		const data = {} as Infer<typeof data_schema>

		if (paid_plan !== custom_data.type) data['paid_plan'] = custom_data.type as UserSchema['paid_plan']
		if (paid_expire !== expires_date) data['paid_expire'] = expires_date

		const has_data = Boolean(Object.keys(data).length)

		if (has_data) {
			await ctx.$db
				.update(User)
				.set({ ...data, update_at: now() })
				.where(eq(User.id, user_id))
		}

		return {
			error: null,
			data: encryptData({ paid_plan, paid_expire, ...data }, refresh_token)
		}
	})
