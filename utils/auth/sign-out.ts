'use client'

import Cookies from 'js-cookie'

export async function signOut(): Promise<{ message: string }> {
	try {
		console.log('📤 [signOut] Sending POST /v1/users/logout')
		
		// Извлекаем auth_token из куки
		const authToken = Cookies.get('auth_token')
		console.log('🔍 [signOut] auth_token:', authToken || 'Not found')
		
		if (!authToken) {
			console.error('❌ [signOut] No auth_token found')
			throw new Error('No auth_token found')
		}
		
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${authToken}`,
		}
		console.log('📋 [signOut] Request headers:', headers)
		
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/users/logout`,
			{
				method: 'POST',
				credentials: 'include', // Для отправки refresh_token (HttpOnly)
				headers,
			}
		)
		
		if (!response.ok) {
			const errorText = await response.text()
			console.error('❌ [signOut] Server error:', response.status, errorText)
			throw new Error(`Ошибка при выходе: ${response.status}`)
		}
		
		const data = await response.json()
		console.log('✅ [signOut] Response:', data)
		
		// Удаляем auth_token из куки на фронтенде (опционально, так как сервер очищает)
		// Cookies.remove('auth_token')
		return data as { message: string }
	} catch (error) {
		console.error('❌ [signOut] Error:', error)
		throw error
	}
}
