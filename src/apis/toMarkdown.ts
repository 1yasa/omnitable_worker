import { array, infer as Infer, literal, object, string, union } from 'zod'

import type { TypedResponse } from 'hono'

const output_type = union([
	object({ error: literal('file_size_overlimit') }),
	object({
		error: literal(null),
		data: array(
			object({
				name: string(),
				content: string()
			})
		)
	})
])

type OutputRefreshToken = Promise<TypedResponse<Infer<typeof output_type>>>

const handler = async (c: AppContext): OutputRefreshToken => {
	const form_data = await c.req.formData()

	const docs: Array<{ name: string; blob: Blob }> = []

	let mds: Array<{ name: string; content: string }> = []

	for (const [_, file] of form_data) {
		if (file instanceof File) {
			docs.push({
				name: file.name,
				blob: new Blob([await file.arrayBuffer()], { type: file.type })
			})
		}
	}

	try {
		const res = await c.env.ai.toMarkdown(docs)

		mds = res.map(item => ({ name: item.name.split('.')[0], content: item.data }))
	} catch (error) {
		if (error instanceof Error && error.message.includes('3006')) {
			return c.json({ error: 'file_size_overlimit' }, 200)
		}

		throw error
	}

	return c.json({ error: null, data: mds }, 200)
}

export default {
	handler
}
