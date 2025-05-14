export async function refreshToken(): Promise<boolean> {
	try {
		const res = await fetch('/v1/users/refresh-token', {
			method: 'POST',
			credentials: 'include',
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
