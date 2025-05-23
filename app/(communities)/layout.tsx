import { CommunityForm } from '@/components/communities/list/community-form'
import { Container } from '@/components/misc/container'
import { FeedUserMenu } from '@/components/misc/feed-user-menu'
import { NavigationMenuForm } from '@/components/misc/navigation-menu-form'
import { SideFooter } from '@/components/misc/side-footer'
import {
	GetCommunitiesDocument,
	GetCommunitiesQueryVariables,
} from '@/graphql/queries/generated/GetCommunities.generated'
import {
	GetStartedLayoutDocument,
	GetStartedLayoutQueryVariables,
} from '@/graphql/queries/generated/GetStartedLayout.generated'
import {
	GetCommunitiesQuery,
	GetStartedLayoutQuery,
} from '@/graphql/schema/graphql'
import { apolloClient } from '@/lib/apollo-client'
import React from 'react'

export default async function CommunitiesLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const apollo = apolloClient()

	const { data: startedLayoutResult, errors: startedLayoutErrors } =
		await apollo.query<GetStartedLayoutQuery, GetStartedLayoutQueryVariables>({
			query: GetStartedLayoutDocument,
			fetchPolicy: 'network-only',
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

	return (
		<>
			<Container className='mt-2'>
				<div className='flex gap-2'>
					{/* Левая часть */}
					<div className='hidden lg:block lg:w-1/4 lg:h-[calc(100vh-6rem)] lg:overflow-auto lg:no-scrollbar'>
						<div className='h-3/4'>
							<FeedUserMenu />

							<CommunityForm
								limit={10}
								communities={communities}
								// loading={loading}
							/>

							<NavigationMenuForm
								data={startedLayoutResult.hostSidebarNavigation?.items}
							/>

							{/* <SocialMenu socialNavigation={startedLayoutResult.hostSocialNavigation} /> */}

							<SideFooter />
						</div>
					</div>

					{/* Правая часть */}
					<div className='w-full lg:w-3/4 lg:h-[calc(100vh-6rem)] lg:overflow-auto lg:no-scrollbar rounded-xl'>
						{children}
					</div>
				</div>
			</Container>
		</>
	)
}
