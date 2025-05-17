import Cookies from 'js-cookie'

export async function refreshToken(): Promise<boolean> {
	try {
		const accessToken = Cookies.get('auth_token')
		if (!accessToken) throw new Error('No auth token')
		const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/users/refresh-token`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
		
		if (!res.ok) {
			console.log(`⚠️ [refreshToken] Failed: ${res.status}`)
			throw new Error('Token refresh failed')
		}
		console.log('✅ [refreshToken] Token refreshed successfully')
		return true
	} catch (err) {
		console.error('[refreshToken] Error:', err)
		return false
	}
}
