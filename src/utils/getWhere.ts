import { sql } from 'drizzle-orm'

export const filters = {
	'is empty': (field: string, _: any) => sql`${sql.identifier(field)} = '' OR ${sql.identifier(field)} IS NULL`,

	'is not empty': (field: string, _: any) =>
		sql`${sql.identifier(field)} != '' AND ${sql.identifier(field)} IS NOT NULL`,

	contains: (field: string, value: string) => sql`${sql.identifier(field)} LIKE ${`%${value}%`}`,

	'does not contain': (field: string, value: string) => sql`${sql.identifier(field)} NOT LIKE ${`%${value}%`}`,

	is: (field: string, value: string) => sql`${sql.identifier(field)} = ${value}`,

	'is not': (field: string, value: string) => sql`${sql.identifier(field)} != ${value}`,

	'is less then': (field: string, value: number) => sql`${sql.identifier(field)} < ${value}`,

	'is less then or equal to': (field: string, value: number) => sql`${sql.identifier(field)} <= ${value}`,

	'is greater then': (field: string, value: number) => sql`${sql.identifier(field)} > ${value}`,

	'is greater then or equal to': (field: string, value: number) => sql`${sql.identifier(field)} >= ${value}`,

	'is between': (field: string, value: [number, number]) =>
		sql`${sql.identifier(field)} BETWEEN ${value[0]} AND ${value[1]}`,

	'is before': (field: string, value: number) => sql`${sql.identifier(field)} < ${value}`,

	'is after': (field: string, value: number) => sql`${sql.identifier(field)} > ${value}`,

	'is on or before': (field: string, value: number) => sql`${sql.identifier(field)} <= ${value}`,

	'is on or after': (field: string, value: number) => sql`${sql.identifier(field)} >= ${value}`,

	'has any of': (field: string, values: any[]) => sql`${sql.identifier(field)} IN (${values.join(', ')})`,

	'has none of': (field: string, values: any[]) => sql`${sql.identifier(field)} NOT IN (${values.join(', ')})`
}
