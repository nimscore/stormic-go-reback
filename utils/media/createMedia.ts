'use client'

import Cookies from 'js-cookie'

export async function createMedia(
	data: FormData,
	dir = 'media'
): Promise<{ id: string; url: string }> {
	data.append('dir', dir)
	try {
		const token = Cookies.get('auth_token')
		if (!token) {
			throw new Error('No auth token found')
		}

		const req = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/media/upload`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: data,
			}
		)

		if (!req.ok) {
			const errorText = await req.text()
			throw new Error(`Ошибка создания медиа: ${req.status} - ${errorText}`)
		}

		const result = await req.json()
		return result
	} catch (error) {
		console.error('Ошибка создания медиа:', error)
		throw error
	}
}
