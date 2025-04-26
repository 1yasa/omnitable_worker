import { eq } from 'drizzle-orm/expressions'

import { User } from '@schema'
import { now } from '@server/utils'

import type { DrizzleDB } from '@server/types'
import type { UserSchema } from '@server/zod'

export const getUser = (db: DrizzleDB, user_id: string) => {
	return db.select().from(User).where(eq(User.id, user_id)).get()
}

export const setInfinity = (db: DrizzleDB, user_id: string, tid: string | null, clear_subscrition?: boolean) => {
	const data = { tid, is_infinity: tid ? true : false, update_at: now() } as Partial<UserSchema>

	if (clear_subscrition) {
		data['paid_plan'] = 'free'
		data['paid_expire'] = null
	}

	return db.update(User).set(data).where(eq(User.id, user_id))
}

export const setPaidPlan = (
	db: DrizzleDB,
	user_id: string,
	tid: string | null,
	paid_plan?: UserSchema['paid_plan'],
	paid_expire?: UserSchema['paid_expire']
) => {
	return db
		.update(User)
		.set({
			tid,
			paid_plan: tid ? paid_plan! : 'free',
			paid_expire: tid ? paid_expire! : null,
			is_infinity: false,
			update_at: now()
		})
		.where(eq(User.id, user_id))
}
