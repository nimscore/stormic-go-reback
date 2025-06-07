import { MainBannerForm } from '@/components/misc/main-banner-form'
import { AboutForm } from '@/components/misc/simple-pages/about-form'
import {
	GetHostDocument,
	GetHostQueryVariables,
} from '@/graphql/queries/generated/GetHost.generated'
import { GetHostQuery } from '@/graphql/schema/graphql'
import { apolloClient } from '@/lib/apollo-server'
import { getSession } from '@/utils/auth/get-session'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Stormic: О проекте',
}

export default async function About() {
	const session = await getSession()
	const currentUser = session && session
	const apollo = apolloClient()

	const { data: hostResult, errors: hostErrors } = await apollo.query<
		GetHostQuery,
		GetHostQueryVariables
	>({
		query: GetHostDocument,
		fetchPolicy: 'cache-first',
		errorPolicy: 'all',
	})

	const ownerId = hostResult.host?.owner?.id

	return (
		<>
			{/* Центральная часть */}
			<MainBannerForm
				stormicName={hostResult.host?.title || 'Stormic'}
				bannerUrl={
					hostResult.host?.banner?.url || '/assets/host/defaultBanner.jpg'
				}
				className='m-2 lg:m-0'
			/>
			<AboutForm
				hostInfo={hostResult.host!}
				hasOwner={
					(currentUser && Number(currentUser.id) === Number(ownerId)) || false
				}
				className='m-2 lg:m-0'
			/>
		</>
	)
}
