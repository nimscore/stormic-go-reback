'use client'

import {
	UserVerifyEmailDocument,
	UserVerifyEmailMutation,
	UserVerifyEmailMutationVariables,
} from '@/graphql/mutations/generated/VerifyEmail.generated'
import { apolloClient } from '@/lib/apollo-client'

export async function verifyEmail(token: string): Promise<{ message: string }> {
	const apollo = apolloClient()
	try {
		console.log(
			'📤 [verifyEmail] Initiating email verification with GraphQL mutation'
		)
		console.log('🔍 [verifyEmail] Token:', token)

		if (!token) {
			throw new Error('Verification token is required')
		}

		const { data: response, errors } = await apollo.mutate<
			UserVerifyEmailMutation,
			UserVerifyEmailMutationVariables
		>({
			mutation: UserVerifyEmailDocument,
			variables: {
				input: {
					token,
				},
			},
		})

		if (errors || !response?.userVerifyEmail) {
			throw new Error(errors?.[0]?.message || 'Email verification failed')
		}

		console.log('✅ [verifyEmail] Response:', response.userVerifyEmail)
		return response.userVerifyEmail
	} catch (error: any) {
		console.error('❌ [verifyEmail] Error:', error.message)
		throw new Error(error.message || 'Failed to verify email')
	}
}
