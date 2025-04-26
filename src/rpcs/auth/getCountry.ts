import { string } from 'zod'

import { app_p } from '@server/utils'

const output_type = string()

export default app_p.output(output_type).query(async ({ ctx }) => {
	return ctx.$c.req.header('cf-ipcountry')!
})
