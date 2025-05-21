import { CommentFeedGroup } from '@/components/comments/comment-feed-group'
import { CommunityForm } from '@/components/communities/list/community-form'
import { Container } from '@/components/misc/container'
import { FeedUserMenu } from '@/components/misc/feed-user-menu'
import { NavigationMenuForm } from '@/components/misc/navigation-menu-form'
import { SideFooter } from '@/components/misc/side-footer'
import { SocialMenu } from '@/components/misc/social-menu'
import {
	GetCommunitiesDocument,
	GetCommunitiesQueryVariables,
} from '@/graphql/queries/generated/GetCommunities.generated'
import {
	GetHostSidebarNavigationDocument,
	GetHostSidebarNavigationQueryVariables,
} from '@/graphql/queries/generated/GetHostSidebarNavigation.generated'
import {
	GetHostSocialNavigationDocument,
	GetHostSocialNavigationQueryVariables,
} from '@/graphql/queries/generated/GetHostSocialNavigation.generated'
import {
	GetCommunitiesQuery,
	GetHostSidebarNavigationQuery,
	GetHostSocialNavigationQuery,
} from '@/graphql/schema/graphql'
import { apolloClient } from '@/lib/apollo-client'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
	title: 'Stormic Community',
}

export default async function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode
	modal: React.ReactNode
}>) {
	const apollo = apolloClient()

	const { data: sidebarNavigationResult, errors: sidebarNavigationErrors } =
		await apollo.query<
			GetHostSidebarNavigationQuery,
			GetHostSidebarNavigationQueryVariables
		>({
			query: GetHostSidebarNavigationDocument,
			fetchPolicy: 'cache-first',
			errorPolicy: 'all',
		})

	const { data: socialNavigationResult, errors: socialNavigationErrors } =
		await apollo.query<
			GetHostSocialNavigationQuery,
			GetHostSocialNavigationQueryVariables
		>({
			query: GetHostSocialNavigationDocument,
			fetchPolicy: 'cache-first',
			errorPolicy: 'all',
		})

	const { data: communitiesResult, errors: communitiesErrors } =
		await apollo.query<GetCommunitiesQuery, GetCommunitiesQueryVariables>({
			query: GetCommunitiesDocument,
			fetchPolicy: 'cache-first',
			errorPolicy: 'all',
			variables: { onlyNotBanned: true },
		})

	const communities = communitiesResult.communities ?? []
	const sidebarNavigation =
		sidebarNavigationResult.hostSidebarNavigation?.items ?? []

	return (
		<>
			<Container className='lg:mt-4'>
				<div className='lg:flex lg:gap-2'>
					{/* Левая часть */}
					<div className='hidden lg:block lg:w-1/4 lg:h-[calc(100vh-6rem)] lg:overflow-auto lg:no-scrollbar'>
						<FeedUserMenu />

						<CommunityForm
							limit={10}
							communities={communities}
							// loading={loading}
						/>

						<NavigationMenuForm data={sidebarNavigation} />

						<SocialMenu socialNavigation={socialNavigationResult} />

						<SideFooter />
					</div>
					{/* Центральная часть */}
					<div className='w-full lg:w-2/4 lg:h-[calc(100vh-6rem)] lg:overflow-auto lg:no-scrollbar lg:rounded-xl'>
						{children}
					</div>

					{/* Правая часть */}
					<div className='hidden lg:block lg:w-1/4 lg:h-[calc(100vh-6rem)] lg:overflow-auto lg:no-scrollbar lg:rounded-xl'>
						<CommentFeedGroup />
					</div>
				</div>
			</Container>
		</>
	)
}
