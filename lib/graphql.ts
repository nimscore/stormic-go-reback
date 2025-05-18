import { GraphQLClient } from 'graphql-request'

export const gqlClient = new GraphQLClient(
	process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8080/query',
	{ credentials: 'include' } // если сессии по cookie
)

export async function gqlRequest<T>(query: string, variables?: Record<string, any>): Promise<T> {
	return gqlClient.request<T>(query, variables)
}
