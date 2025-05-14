// 'use client'

// import { useAuthStore } from '@/store/authStore'
// import { refreshToken } from '@/utils/auth/refresh-token'
// import { useEffect } from 'react'

'use client'

import { refreshToken } from '@/utils/auth/refresh-token'
import { useEffect } from 'react'

export function AuthWatcher() {
	useEffect(() => {
		const interval = setInterval(async () => {
			console.log('[AuthWatcher] Refreshing token...')
			const success = await refreshToken()
			if (!success) {
				console.warn('[AuthWatcher] Failed to refresh token')
			}
		}, 10 * 60 * 1000) // Каждые 10 минут

		return () => clearInterval(interval)
	}, [])

	return null
}

// export function AuthWatcher() {
// 	const { accessToken } = useAuthStore()

// 	useEffect(() => {
// 		if (!accessToken) return

// 		const interval = setInterval(async () => {
// 			console.log('[AuthWatcher] Refreshing token...')
// 			await refreshToken()
// 		}, 10 * 60 * 1000) // каждые 10 минут

// 		return () => clearInterval(interval)
// 	}, [accessToken])

// 	return null
// }
