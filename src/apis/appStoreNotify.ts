import {
	decodeNotificationPayload,
	decodeTransaction,
	isDecodedNotificationDataPayload,
	isDecodedNotificationSummaryPayload,
	NotificationSubtype,
	NotificationType
} from 'app-store-server-api'
import { eq } from 'drizzle-orm/expressions'
import { infer as Infer, string } from 'zod'

import { User } from '@schema'
import { now } from '@server/utils'

import type { TypedResponse } from 'hono'

const output_type = string()

type OutputRefreshToken = Promise<TypedResponse<Infer<typeof output_type>>>

const clearPaidData = async (c: AppContext, id: string) => {
	await c.var.$db
		.update(User)
		.set({ paid_plan: 'free', paid_expire: null, paid_renewal: null, update_at: now() })
		.where(eq(User.id, id))
}

const handler = async (c: AppContext): OutputRefreshToken => {
	const { signedPayload } = await c.req.json()

	console.log('appStoreNotify.signedPayload: ', signedPayload)

	const payload = await decodeNotificationPayload(signedPayload as string)

	console.log('appStoreNotify.payload: ', payload)

	const { notificationType } = payload
	const subtype = payload.subtype! as `${NotificationSubtype}`

	if (isDecodedNotificationDataPayload(payload)) {
		const { data } = payload
		const { signedTransactionInfo } = data

		const transaction = await decodeTransaction(signedTransactionInfo)

		console.log('appStoreNotify.transaction: ', transaction)

		const { originalTransactionId } = transaction

		const res_user = await c.var.$db.select().from(User).where(eq(User.tid, originalTransactionId)).get()

		console.log('appStoreNotify.res_user: ', res_user)

		if (!res_user) return c.text('error', 503)

		const { id } = res_user

		console.log('appStoreNotify.notificationType: ', notificationType)
		console.log('appStoreNotify.subtype: ', subtype)

		switch (notificationType as `${NotificationType}`) {
			// 发起了退款请求，提供消费数据
			case 'CONSUMPTION_REQUEST':
			// 用户更改订阅计划
			case 'DID_CHANGE_RENEWAL_PREF':
			// 订阅由于计费问题而未能续订
			case 'DID_FAIL_TO_RENEW':
			// 订阅成功续订
			case 'DID_RENEW':
			// 宽限期已结束
			case 'GRACE_PERIOD_EXPIRED':
			// 用户兑换了促销优惠或优惠代码
			case 'OFFER_REDEEMED':
			// 订阅涨价的用户反馈
			case 'PRICE_INCREASE':
			// 用户退款
			case 'REFUND':
			// 拒绝退款
			case 'REFUND_DECLINED':
			// 撤销退款
			case 'REFUND_REVERSED':
			// 延长特定订阅的订阅日期
			case 'RENEWAL_EXTENDED':
			// 延长所有订阅的订阅日期
			case 'RENEWAL_EXTENSION':
			// 家庭购买退出
			case 'REVOKE':
				break

			case 'DID_CHANGE_RENEWAL_STATUS':
				if (subtype === 'AUTO_RENEW_ENABLED') {
					// 重新续订
				} else if (subtype === 'AUTO_RENEW_DISABLED') {
					//不再续订
					clearPaidData(c, id)
				}

				break

			case 'SUBSCRIBED':
				break

			case 'EXPIRED':
				clearPaidData(c, id)
				break
		}
	}

	if (isDecodedNotificationSummaryPayload(payload)) {
		const { summary } = payload

		console.log('appStoreNotify.summary: ', summary)
	}

	return c.text('success', 200)
}

export default {
	handler
}
