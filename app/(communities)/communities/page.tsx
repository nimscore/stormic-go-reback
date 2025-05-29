import { NewCommunityButton } from '@/components/buttons/new-community-button'
import { CommunityCardGroup } from '@/components/communities/card/community-card-group'
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
import { apolloClient } from '@/lib/apollo-server'

export default async function CommunitiesPage() {
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
			<div className='lg:flex lg:w-full lg:gap-2'>
				<div className='hidden lg:block w-3/4 bg-secondary rounded-xl' />
				<div className='w-full lg:w-1/4 mb-2 lg:mb-0'>
					<NewCommunityButton
						authImage={
							startedLayoutResult.host?.authBanner?.url ||
							'/assets/host/defaultBanner.jpg'
						}
						logoImage={
							startedLayoutResult.host?.logo?.url || '/assets/host/logo.png'
						}
						stormicName={startedLayoutResult.host?.title || 'Stormic'}
						className='mx-2 lg:mx-0'
					/>
				</div>
			</div>
			<CommunityCardGroup
				communities={communities}
				className='mb-2 lg:mb-0 lg:mt-2'
			/>
		</>
	)
}
