// import Cookies from 'js-cookie'

export async function signIn(data: { email: string; password: string }) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/users/login`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
			credentials: 'include',
		}
	)
	if (!res.ok) {
		const errorData = await res.json()
		throw new Error(errorData.error || 'Login failed')
	}
	return { success: true }
}

// export async function signIn(data: { email: string; password: string }) {
// 	try {
// 		const res = await fetch(
// 			`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/users/login`,
// 			{
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json',
// 				},
// 				body: JSON.stringify(data),
// 				cache: 'no-store',
// 			}
// 		)

// 		if (!res.ok) {
// 			const errorData = await res.json()
// 			throw new Error(errorData.error || 'Login failed')
// 		}

// 		const result = await res.json()
// 		const token = result.accessToken

// 		// Сохраняем токен в cookie
// 		Cookies.set('auth-token', token, {
// 			expires: 7, // 7 дней
// 			secure: process.env.NODE_ENV === 'production',
// 			sameSite: 'Lax',
// 		})

// 		return { success: true }
// 	} catch (error) {
// 		throw error
// 	}
// }
