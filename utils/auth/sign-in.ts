import { TFormLoginValues } from '@/components/modals/auth-modal/forms/schemas'
import {
	LoginUserDocument,
	LoginUserMutationVariables,
} from '@/graphql/mutations/generated/LoginUser.generated'
import { LoginUserMutation } from '@/graphql/schema/graphql'
import { apolloClient } from '@/lib/apollo-client'

interface LoginResponse {
	accessToken: string
	refreshToken: string
	user: {
		id: string
	}
}

export async function signIn(data: TFormLoginValues): Promise<LoginResponse> {
	const apollo = apolloClient()

	try {
		const { data: response, errors } = await apollo.mutate<
			LoginUserMutation,
			LoginUserMutationVariables
		>({
			mutation: LoginUserDocument,
			variables: {
				input: {
					email: data.email,
					password: data.password,
				},
			},
		})

		if (errors || !response?.loginUser) {
			throw new Error(errors?.[0]?.message || 'Login failed')
		}

		return response.loginUser
	} catch (error: any) {
		throw new Error(error.message || 'Failed to sign in')
	}
}
