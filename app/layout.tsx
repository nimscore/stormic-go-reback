import { Header } from '@/components/header/header'
import {
	GetCommunitiesDocument,
	GetCommunitiesQueryVariables,
} from '@/graphql/queries/generated/GetCommunities.generated'
import {
	GetHostDocument,
	GetHostQueryVariables,
} from '@/graphql/queries/generated/GetHost.generated'
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
	GetHostQuery,
	GetHostSidebarNavigationQuery,
	GetHostSocialNavigationQuery,
} from '@/graphql/schema/graphql'
import { apolloClient } from '@/lib/apollo-client'
import { Providers } from '@/providers'
import { User } from '@/schema/types'
import { getSession } from '@/utils/auth/get-session'
import { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import React, { Suspense } from 'react'
import './globals.css'

export const metadata: Metadata = {
	title: 'Stormic Community',
	twitter: {
		card: 'summary_large_image',
		creator: '@nimscore',
	},
}

const nunito = Nunito({
	subsets: ['cyrillic'],
	variable: '--font-nunito',
	weight: ['400', '500', '600', '700', '800', '900'],
})

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const counterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA
	const session = (await getSession()) as { user: User } | null
	const currentUser = session && session.user
	const apollo = apolloClient()

	const { data: sidebarNavigationResult, errors: sidebarNavigationErrors } =
		await apollo.query<
			GetHostSidebarNavigationQuery,
			GetHostSidebarNavigationQueryVariables
		>({
			query: GetHostSidebarNavigationDocument,
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
		})

	const { data: communitiesResult, errors: communitiesErrors } =
		await apollo.query<GetCommunitiesQuery, GetCommunitiesQueryVariables>({
			query: GetCommunitiesDocument,
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
			variables: { onlyNotBanned: true },
		})

	const { data: hostResult, errors: hostResultErrors } = await apollo.query<
		GetHostQuery,
		GetHostQueryVariables
	>({
		query: GetHostDocument,
		fetchPolicy: 'network-only',
		errorPolicy: 'all',
	})

	const { data: socialNavigationResult, errors: socialNavigationErrors } =
		await apollo.query<
			GetHostSocialNavigationQuery,
			GetHostSocialNavigationQueryVariables
		>({
			query: GetHostSocialNavigationDocument,
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
		})

	// это киентский запрос
	// const { data, loading, error } = useQuery(GET_COMMUNITIES)

	// это с трай-кэтчем
	// const [updateHost, { data, loading, error }] = useUpdateHostMutation()
	// const onToggleFirstSettings = async (value: boolean) => {
	//   try {
	//     const result = await updateHost({
	//       variables: {
	//         input: { firstSettings: value }
	//       },
	//     })
	//     console.log('Обновлённый host:', result.data?.host)
	//   } catch (e) {
	//     console.error(e)
	//   }
	// }

	// а это без трай-кэтча
	// const { data: hostResult, errors } = await apollo.mutate<
	// 	UpdateHostMutation,
	// 	UpdateHostMutationVariables
	// >({
	// 	mutation: UpdateHostDocument,
	// 	variables: {
	// 		input: {
	// 			title: 'Stormic',
	// 			firstSettings: true,
	// 		},
	// 	},
	// })

	/////////////////////

	// const { data: usersResult, errors: usersErrors } = await apollo.query<
	// 	GetUsersQuery,
	// 	GetUsersQueryVariables
	// >({
	// 	query: GetUsersDocument,
	// 	fetchPolicy: 'network-only',
	// 	errorPolicy: 'all',
	// })

	// console.log('Пользователи:', JSON.stringify(usersResult.users, null, 2))

	// const { data: userResult, errors: userErrors } = await apollo.query<
	// 	GetUserByIdQuery,
	// 	GetUserByIdQueryVariables
	// >({
	// 	query: GetUserByIdDocument,
	// 	fetchPolicy: 'network-only',
	// 	errorPolicy: 'all',
	// 	variables: { id: '2' },
	// })

	// console.log('Пользователь по ID:', JSON.stringify(userResult.user, null, 2))

	// const { data: mediaResult, errors: mediaErrors } = await apollo.query<
	// 	GetMediaByIdQuery,
	// 	GetMediaByIdQueryVariables
	// >({
	// 	query: GetMediaByIdDocument,
	// 	fetchPolicy: 'network-only',
	// 	errorPolicy: 'all',
	// 	variables: { id: '1' },
	// })

	// console.log('Media по ID:', JSON.stringify(mediaResult.media, null, 2))

	// Базовая разметка, которая будет использоваться в обоих случаях
	const baseLayout = (content: React.ReactNode) => (
		<html lang='en' suppressHydrationWarning>
			<head>
				<link href='/favicon.ico' rel='icon' sizes='32x32' />
				{/* <link href='/favicon.svg' rel='icon' type='image/svg+xml'/> */}
			</head>
			<body className={nunito.className}>
				<Providers session={session}>
					<main className='min-h-screen'>{content}</main>
				</Providers>
			</body>
		</html>
	)

	// Если пользователь не авторизован
	if (!currentUser) {
		return baseLayout(
			<>
				<Suspense>
					<Header
						hostSettings={hostResult}
						communities={communitiesResult}
						hostSidebarNavigation={sidebarNavigationResult}
						socialNavigation={socialNavigationResult}
					/>
				</Suspense>
				<div className='min-h-[calc(100vh-8rem)]'>{children}</div>
			</>
		)
	}

	return baseLayout(
		<>
			<Suspense>
				<Header
					hostSettings={hostResult}
					communities={communitiesResult}
					hostSidebarNavigation={sidebarNavigationResult}
					socialNavigation={socialNavigationResult}
					currentUser={currentUser}
				/>
			</Suspense>
			<div className='min-h-[calc(100vh-8rem)]'>{children}</div>
		</>
	)
}
