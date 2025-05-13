import { User } from '@/schema/types'
import { cookies } from 'next/headers'

export async function signIn(data: { email: string; password: string }) {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/users/login`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
				cache: 'no-store',
			}
		)
		
		if (!res.ok) {
			const errorData = await res.json()
			throw new Error(errorData.error || 'Login failed')
		}
		
		const { access_token } = await res.json()
		
		// Сохраняем токен в куки
		document.cookie = `auth-token=${access_token}; path=/; max-age=900; HttpOnly; Secure=${
			process.env.NODE_ENV === 'production'
		}; SameSite=Strict`
		
		return { success: true }
	} catch (error) {
		throw error
	}
}
