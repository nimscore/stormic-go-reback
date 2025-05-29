import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import fetch from 'cross-fetch'
import { cookies } from 'next/headers'

const authLink = setContext(async (_, { headers }) => {
	const cookieStore = await cookies()
	const token = cookieStore.get('auth_token')?.value
	if (!token) {
		return null
	}
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	}
})

const httpLink = new HttpLink({
	uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8080/query',
	fetch,
	credentials: 'include',
})

export function apolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: from([authLink, httpLink]),
		cache: new InMemoryCache({ addTypename: false }),
	})
}
