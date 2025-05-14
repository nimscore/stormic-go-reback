// import { cookies } from 'next/headers'

import Cookies from 'js-cookie'

export async function getSession() {
	const token = Cookies.get('auth_token')
	if (!token) {
		console.log('⚠️ [getSession] auth_token cookie not found')
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

// export async function getSession() {
// 	const cookieStore = await cookies()
// 	const token = cookieStore.get('auth-token')?.value

// 	if (!token) return null

// 	try {
// 		const res = await fetch(
// 			`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/users/me`,
// 			{
// 				headers: {
// 					Authorization: `Bearer ${token}`,
// 				},
// 				cache: 'no-store',
// 			}
// 		)

// 		if (!res.ok) return null
// 		const data = await res.json()

// 		return { user: data, token }
// 	} catch (e) {
// 		console.error('Ошибка при получении сессии', e)
// 		return null
// 	}
// }
