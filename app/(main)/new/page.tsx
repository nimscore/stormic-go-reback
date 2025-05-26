import { SortFreshFeedButtons } from '@/components/misc/sort-fresh-feed-buttons'
import { PostForm } from '@/components/posts/post-form'
import {
	GetCommunitiesDocument,
	GetCommunitiesQueryVariables,
} from '@/graphql/queries/generated/GetCommunities.generated'
import {
	GetPostsDocument,
	GetPostsQueryVariables,
} from '@/graphql/queries/generated/GetPosts.generated'
import {
	GetCommunitiesQuery,
	GetPostsQuery,
	PostStatus,
} from '@/graphql/schema/graphql'
import { apolloClient } from '@/lib/apollo-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Stormic: Свежее',
}

export default async function Home() {
	const apollo = apolloClient()

	const { data: postsResult, errors: postsErrors } = await apollo.query<
		GetPostsQuery,
		GetPostsQueryVariables
	>({
		query: GetPostsDocument,
		fetchPolicy: 'network-only',
		errorPolicy: 'all',
		variables: { status: PostStatus.Published },
	})

	const { data: communitiesResult, errors: communitiesErrors } =
		await apollo.query<GetCommunitiesQuery, GetCommunitiesQueryVariables>({
			query: GetCommunitiesDocument,
			fetchPolicy: 'cache-first',
			errorPolicy: 'all',
			variables: { onlyNotBanned: true },
		})

	const posts = postsResult.posts ?? []
	console.log('posts:', posts)
	const communities = communitiesResult.communities ?? []

	return (
		<div>
			<SortFreshFeedButtons className='m-2 lg:m-0' />
			<PostForm
				limit={5}
				posts={posts}
				communities={communities}
				className='lg:mt-2'
			/>
		</div>
	)
}
