import to from 'await-to-js'
import dayjs from 'dayjs'
import { infer as Infer, literal, number, object, union } from 'zod'

import { EventName } from '@paddle/paddle-node-sdk'
import { getPaddle, now, now_ms } from '@server/utils'
import { getUser, setInfinity, setPaidPlan } from '@server/utils/user'

import type { TypedResponse } from 'hono'
import type { TransactionNotification, AdjustmentNotification, SubscriptionNotification } from '@paddle/paddle-node-sdk'
import type { UserSchema } from '@server/zod'
import type { UserTypes } from '@server/types/user'

const output_type = union([
	object({ error: literal('validate_error') }),
	object({ error: literal('user_not_exist') }),
	object({ error: literal(null), timestamp: number() })
])

type OutputRefreshToken = Promise<TypedResponse<Infer<typeof output_type>>>

const handler = async (c: AppContext): OutputRefreshToken => {
	const paddle = getPaddle(c)
	const body = await c.req.text()
	const signature = c.req.header('paddle-signature')
	const secret = c.env.paddle_webhook_secret

	const return_ok = c.json({ error: null, timestamp: now() }, 200)

	if (!signature) return return_ok

	const [err, event] = await to(paddle.webhooks.unmarshal(body, secret, signature))

	if (err) return c.json({ error: 'validate_error' }, 200)

	// console.log(event.eventType, event)

	let data = event.data
	let custom_data

	switch (event.eventType) {
		case EventName.TransactionPaid:
			data = event.data as TransactionNotification
			custom_data = data.customData as UserTypes.CustomData

			if (custom_data.type === 'pro') return return_ok

			const user = await getUser(c.var.$db, custom_data.user_id)

			if (!user) return c.json({ error: 'user_not_exist' }, 200)

			const { paid_plan, paid_expire, tid } = user

			const clear_subscrition = Boolean(
				paid_plan && paid_expire && tid && paid_plan !== 'free' && paid_expire > now_ms()
			)

			await setInfinity(c.var.$db, custom_data.user_id, data.id, clear_subscrition)

			if (clear_subscrition) {
				await paddle.subscriptions.cancel(tid!, { effectiveFrom: 'immediately' })
			}

			break
		case EventName.SubscriptionActivated:
			data = event.data as SubscriptionNotification
			custom_data = data.customData as UserTypes.CustomData

			await setPaidPlan(
				c.var.$db,
				custom_data.user_id,
				data.id,
				custom_data.type as UserSchema['paid_plan'],
				dayjs(data.currentBillingPeriod?.endsAt).valueOf()
			)

			break
		case EventName.SubscriptionCanceled:
			data = event.data as SubscriptionNotification
			custom_data = data.customData as UserTypes.CustomData

			const s_user = await getUser(c.var.$db, custom_data.user_id)

			if (!s_user) return c.json({ error: 'user_not_exist' }, 200)

			if (s_user.is_infinity) {
				return return_ok
			} else {
				await setPaidPlan(c.var.$db, custom_data.user_id, null)
			}

			break
		case EventName.AdjustmentUpdated:
			data = event.data as AdjustmentNotification

			if ((data.action === 'refund' && data.status === 'approved') || data.action === 'chargeback') {
				const transaction = await paddle.transactions.get(data.transactionId)
				const custom_data = transaction.customData as UserTypes.CustomData

				const user = await getUser(c.var.$db, custom_data.user_id)

				if (!user) return c.json({ error: 'user_not_exist' }, 200)

				if (custom_data.type === 'infinity') {
					await setInfinity(c.var.$db, custom_data.user_id, null)
				} else {
					await setPaidPlan(c.var.$db, custom_data.user_id, null)
				}
			}

			break
	}

	return return_ok
}

export default {
	handler
}
