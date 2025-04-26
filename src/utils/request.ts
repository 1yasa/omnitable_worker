import { ofetch } from 'ofetch'

export const verify = ofetch.create({
	// baseURL: 'https://verify.openages.com',
	onRequest() {},
	onResponse() {},
	onResponseError() {}
})
