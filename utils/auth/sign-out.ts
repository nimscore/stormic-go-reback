'use client'

import {
	LogoutUserDocument,
	LogoutUserMutationVariables,
} from '@/graphql/mutations/generated/LogoutUser.generated'
import { LogoutUserMutation } from '@/graphql/schema/graphql'
import { apolloClient } from '@/lib/apollo-client'

export async function signOut(): Promise<{ message: string }> {
	const apollo = apolloClient()
	try {
		const { data: response, errors } = await apollo.mutate<
			LogoutUserMutation,
			LogoutUserMutationVariables
		>({
			mutation: LogoutUserDocument,
		})

		if (errors || !response?.logoutUser) {
			throw new Error(errors?.[0]?.message || 'Login failed')
		}

		return response.logoutUser
	} catch (error: any) {
		throw new Error(error.message || 'Failed to signOut')
	}
}
