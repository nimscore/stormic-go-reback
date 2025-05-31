'use client'

import {
	UserRefreshTokenDocument,
	UserRefreshTokenMutationVariables,
} from '@/graphql/mutations/generated/UserRefreshToken.generated'
import { UserRefreshTokenMutation } from '@/graphql/schema/graphql'
import { apolloClient } from '@/lib/apollo-client'
import Cookies from 'js-cookie'

export async function refreshToken(): Promise<boolean> {
	const apollo = apolloClient()

	try {
		const { data: response, errors } = await apollo.mutate<
			UserRefreshTokenMutation,
			UserRefreshTokenMutationVariables
		>({
			mutation: UserRefreshTokenDocument,
			// variables: {
			// 	input: {
			// 		email: data.email,
			// 		password: data.password,
			// 	},
			// },
		})

		if (errors || !response?.userRefreshToken) {
			console.log(`⚠️ [refreshToken] GraphQL errors: ${JSON.stringify(errors)}`)
			throw new Error('Token refresh failed')
		}

		// Сохраняем новые токены в cookies
		Cookies.set('auth_token', response.userRefreshToken.accessToken, {
			expires: 1 / 24, // 1 час
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
		})
		Cookies.set('refresh_token', response.userRefreshToken.refreshToken, {
			expires: 7, // 7 дней
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
		})

		console.log('✅ [refreshToken] Token refreshed successfully')
		return true
	} catch (err) {
		console.error('[refreshToken] Error:', err)
		return false
	}
}
