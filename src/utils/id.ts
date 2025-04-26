import { init } from '@paralleldrive/cuid2'

export default init({ length: 30 })

export const getId = (length?: number) => init({ length: length || 30 })()
