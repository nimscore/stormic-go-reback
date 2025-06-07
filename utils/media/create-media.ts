'use client'

import { UploadMediaDocument } from '@/graphql/mutations/generated/UploadMedia.generated'
import { print } from 'graphql'
import Cookies from 'js-cookie'

export interface Media {
	id: string
	url: string
	filename: string
}

export async function createMedia(file: File, dir = 'media'): Promise<Media> {
	const token = Cookies.get('auth_token')
	if (!token) {
		throw new Error('No auth token found')
	}

	const mutation = print(UploadMediaDocument)

	// 3. Готовим GraphQL-операции
	const operations = {
		query: mutation,
		variables: {
			file: null as unknown,
			dir,
		},
	}

	const map = {
		'0': ['variables.file'],
	}

	// 4. Формируем FormData
	const formData = new FormData()
	formData.append('operations', JSON.stringify(operations))
	formData.append('map', JSON.stringify(map))
	formData.append('0', file)

	// 5. Отправляем fetch к GraphQL-эндпоинту
	const graphqlEndpoint =
		process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8080/query'
	const response = await fetch(graphqlEndpoint, {
		method: 'POST',
		credentials: 'include',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	})

	if (!response.ok) {
		const errorText = await response.text()
		throw new Error(
			`Ошибка GraphQL uploadMedia: ${response.status} — ${errorText}`
		)
	}

	const json = (await response.json()) as {
		data?: {
			uploadMedia: {
				id: string | null
				url: string | null
				filename: string | null
			}
		}
		errors?: Array<{ message: string }>
	}

	if (json.errors && json.errors.length > 0) {
		console.error('GraphQL errors:', json.errors)
		throw new Error('Ошибка GraphQL при создании медиа')
	}
	if (!json.data || !json.data.uploadMedia) {
		throw new Error('Нет данных в ответе uploadMedia')
	}

	const upload = json.data.uploadMedia
	if (!upload.id) throw new Error('uploadMedia.id вернул null')
	if (!upload.url) throw new Error('uploadMedia.url вернул null')
	if (!upload.filename) throw new Error('uploadMedia.filename вернул null')

	return {
		id: upload.id,
		url: upload.url,
		filename: upload.filename,
	}
}
