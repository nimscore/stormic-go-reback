import { cookies } from 'next/headers'

export async function getSession() {
	const cookieStore = await cookies()
	const token = cookieStore.get('auth_token')?.value
	if (!token) {
		return null
	}

	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/users/me`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				credentials: 'include',
				cache: 'no-store',
			}
		)

		if (!res.ok) {
			console.log(`⚠️ [getSession] Failed to fetch user: ${res.status}`)
			return null
		}
		return res.json()
	} catch (e) {
		console.error('Ошибка при получении сессии', e)
		return null
	}
}
