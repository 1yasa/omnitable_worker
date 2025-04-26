import KV from 'keyv'

export const kv_captcha = new KV({ ttl: 1000 * 60 * 6 })
