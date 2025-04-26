import { and, between, eq, like, or } from 'drizzle-orm'

import type { SQLiteTable } from 'drizzle-orm/sqlite-core'
import type { SQLWrapper } from 'drizzle-orm'

type Condition<K> =
	| {
			type: 'eq' | 'like'
			key: K
			value?: any
	  }
	| {
			type: 'between'
			key: K
			value?: [number, number]
	  }

export default <T extends SQLiteTable, K extends keyof T = keyof T>(
	schema: T,
	query: Array<Condition<K>>,
	type: 'and' | 'or'
) => {
	const conditions = [] as Array<SQLWrapper>

	query.forEach(({ type, key, value }) => {
		if (value) {
			const schema_value = schema[key] as any

			let condition: SQLWrapper | null = null

			switch (type) {
				case 'eq':
					condition = eq(schema_value, value)
					break
				case 'like':
					condition = like(schema_value, `%${value}%`)
					break
				case 'between':
					condition = between(schema_value, value[0], value[1])
					break
			}

			conditions.push(condition)
		}
	})

	return type === 'and' ? and(...conditions) : or(...conditions)
}
