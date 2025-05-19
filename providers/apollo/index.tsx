'use client'

import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider as Provider,
} from '@apollo/client'

export function ApolloProvider({ children }: { children: React.ReactNode }) {
	const client = new ApolloClient({
		uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8080/query',
		credentials: 'include',
		cache: new InMemoryCache(),
	})

	return <Provider client={client}>{children}</Provider>
}
