import {
	ApolloClient,
	HttpLink,
	InMemoryCache,
	NormalizedCacheObject,
} from '@apollo/client'
import fetch from 'cross-fetch'

export function apolloClient(): ApolloClient<NormalizedCacheObject> {
	return new ApolloClient({
		ssrMode: true,
		link: new HttpLink({
			uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8080/query',
			credentials: 'include',
			fetch,
		}),
		cache: new InMemoryCache({
			addTypename: false,
		}),
	})
}
