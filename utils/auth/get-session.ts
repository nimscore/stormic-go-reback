import {
	GetMeDocument,
	GetMeQueryVariables,
} from '@/graphql/queries/generated/GetMe.generated'
import { GetMeQuery } from '@/graphql/schema/graphql'
import { apolloClient } from '@/lib/apollo-server'

export async function getSession() {
	const apollo = apolloClient()

	try {
		const { data: getMeResult, errors: getMeErrors } = await apollo.query<
			GetMeQuery,
			GetMeQueryVariables
		>({
			query: GetMeDocument,
			fetchPolicy: 'no-cache',
			errorPolicy: 'all',
		})

		if (getMeErrors || !getMeResult?.getMe) {
			console.log(
				`⚠️ [getSession] GraphQL errors: ${
					getMeErrors?.[0]?.message || 'No user data'
				}`
			)
			return null
		}

		return getMeResult.getMe
	} catch (e) {
		console.error('Ошибка при получении сессии', e)
		return null
	}
}
