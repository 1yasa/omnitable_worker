import hashPassword from './hashPassword'

export default async (password: string, db_password_hash: string, db_password_salt: string) => {
	const salt = new Uint8Array(db_password_salt.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))

	const { password_hash } = await hashPassword(password, salt)

	return password_hash === db_password_hash
}
