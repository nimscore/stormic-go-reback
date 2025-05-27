import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import fetch from 'cross-fetch'
import { cookies } from 'next/headers'

async function getAuthToken() {
	if (typeof window === 'undefined') {
		try {
			const cookieStore = await cookies()
			const token = cookieStore.get('auth_token')?.value
			return token || null
		} catch (e) {
			console.error('Ошибка получения токена на сервере:', e)
			return null
		}
	}

	const cookieString = document.cookie
	const cookieArray = cookieString.split(';')
	for (let cookie of cookieArray) {
		const [name, value] = cookie.trim().split('=')
		if (name === 'auth_token') {
			return value
		}
	}
	return null
}

const authLink = setContext(async (_, { headers }) => {
	const token = await getAuthToken()
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
