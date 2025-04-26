export default async (password: string, salt_value?: Uint8Array) => {
	const encoder = new TextEncoder()
	const salt = salt_value || crypto.getRandomValues(new Uint8Array(16))

	const material_key = await crypto.subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, [
		'deriveBits',
		'deriveKey'
	])

	const key = await crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: salt.buffer as ArrayBuffer,
			iterations: 100000,
			hash: 'SHA-256'
		},
		material_key,
		{ name: 'AES-GCM', length: 256 },
		true,
		['encrypt', 'decrypt']
	)

	const exported_key = await crypto.subtle.exportKey('raw', key)

	const hash_array = Array.from(new Uint8Array(exported_key as ArrayBuffer))

	const password_hash = hash_array.map(v => v.toString(16).padStart(2, '0')).join('')

	const password_salt = Array.from(salt)
		.map(v => v.toString(16).padStart(2, '0'))
		.join('')

	return { password_hash, password_salt }
}
