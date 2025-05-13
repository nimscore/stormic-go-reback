import { User } from '@/schema/types'
import { cookies } from 'next/headers'

export async function getSession(): Promise<User | null> {
	const cookieStore = await cookies()
	const token = cookieStore.get('auth-token')?.value
	
	if (!token) {
		return null
	}
	
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/users/me`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				cache: 'no-store',
			}
		)
		
		if (!res.ok) {
			return null
		}
		
		const data = await res.json()
		const user = data.user as User
		
		return user || null
	} catch (error) {
		console.error('Ошибка получения сессии:', error)
		return null
	}
}
