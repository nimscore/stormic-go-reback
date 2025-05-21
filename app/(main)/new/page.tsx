import { SortFreshFeedButtons } from '@/components/misc/sort-fresh-feed-buttons'
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
	User,
} from '@/graphql/schema/graphql'
import { apolloClient } from '@/lib/apollo-client'
import { getUserPermissions } from '@/lib/getUserPermissions'
import { Permissions } from '@/lib/permissions'
// import { PostForm } from '@/shared/components/posts/post-items/post-form'
import { getSession } from '@/utils/auth/get-session'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Stormic: Свежее',
}

export default async function Home() {
	const session = (await getSession()) as { user: User } | null
	const currentUser = session && session.user
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
	const communities = communitiesResult.communities ?? []

	// Получаем права для каждого поста
	const postPermissions: Record<string, Permissions | null> = {}
	if (currentUser) {
		await Promise.all(
			posts.map(async post => {
				const communityId = post.community.id
				postPermissions[post.id] = communityId
					? await getUserPermissions(currentUser.id, communityId)
					: null
			})
		)
	}

	return (
		<>
			<SortFreshFeedButtons className='m-2 lg:m-0' />
			{/* <PostForm
				limit={5}
				post={posts}
				communities={communities}
				postPermissions={postPermissions}
				className='lg:mt-2'
			/> */}
		</>
	)
}
