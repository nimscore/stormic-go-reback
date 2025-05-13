/**
 * This interface represents the User entity.
 */
export interface User {
	id: number
	name: string
	email: string
	password_hash: string
	salt: string
	created_at: string
	updated_at: string
	is_verified: boolean
	emailVerifications?: {
		docs?: (number | EmailVerification)[]
		hasNextPage?: boolean
		totalDocs?: number
	}
}

/**
 * This interface represents the EmailVerification entity.
 */
export interface EmailVerification {
	id: number
	user: number | User
	token: string
	expires_at: string // ISO 8601 string for Date
	created_at: string // ISO 8601 string for Date
	updated_at: string // ISO 8601 string for Date
}
