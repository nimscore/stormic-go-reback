'use client'

import {
	RegisterUserDocument,
	RegisterUserMutationVariables,
} from '@/graphql/mutations/generated/RegisterUser.generated'
import { RegisterUserMutation } from '@/graphql/schema/graphql'
import { apolloClient } from '@/lib/apollo-client'

export interface RegisterUserInput {
	name: string
	email: string
	password: string
	confirmPassword?: string // Для совместимости с формой
}

export async function registerUser(
	input: RegisterUserInput
): Promise<{ message: string }> {
	const apollo = apolloClient()
	try {
		console.log(
			'📤 [registerUser] Initiating user registration with GraphQL mutation'
		)
		console.log('🔍 [registerUser] Input:', {
			name: input.name,
			email: input.email,
		})

		if (!input.name || !input.email || !input.password) {
			throw new Error('Name, email, and password are required')
		}

		const { data: response, errors } = await apollo.mutate<
			RegisterUserMutation,
			RegisterUserMutationVariables
		>({
			mutation: RegisterUserDocument,
			variables: {
				input: {
					name: input.name,
					email: input.email,
					password: input.password,
				},
			},
		})

		if (errors || !response?.registerUser) {
			throw new Error(errors?.[0]?.message || 'User registration failed')
		}

		console.log('✅ [registerUser] Response:', response.registerUser)
		return {
			message: response.registerUser.message,
		}
	} catch (error: any) {
		console.error('❌ [registerUser] Error:', error.message)
		throw new Error(error.message || 'Failed to register user')
	}
}
