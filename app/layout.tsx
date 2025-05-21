import { Header } from '@/components/header/header'
import { UserBanLogin } from '@/components/info-blocks/user-ban-login'
import YandexMetrika from '@/components/misc/yandex-metrika'
import { MobileButtonNavBar } from '@/components/mobile/mobile-button-nav-bar'
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
	GetHostUserBanByIdDocument,
	GetHostUserBanByIdQueryVariables,
} from '@/graphql/queries/generated/GetHostUserBanById.generated'
import {
	GetCommunitiesQuery,
	GetHostQuery,
	GetHostSidebarNavigationQuery,
	GetHostSocialNavigationQuery,
	GetHostUserBanByIdQuery,
} from '@/graphql/schema/graphql'
import { apolloClient } from '@/lib/apollo-client'
import { Providers } from '@/providers'
import { User } from '@/schema/types'
import { getSession } from '@/utils/auth/get-session'
import { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import Script from 'next/script'
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

	// это клиентский запрос
	// const { data, loading, error } = useQuery(GET_COMMUNITIES)

	// это мутация
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
				<Script id='metrika-counter' strategy='afterInteractive'>
					{counterId
						? `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(${JSON.stringify(counterId)}, "init", {
          defer: true,
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true
        });`
						: ''}
				</Script>
				<Suspense fallback={<></>}>
					<YandexMetrika />
				</Suspense>
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
				<div className='sticky bottom-0 lg:hidden'>
					<MobileButtonNavBar />
				</div>
			</>
		)
	}

	// Если пользователь авторизован, проверяем бан
	const { data: hostUserBanResult, errors: hostUserBanErrors } =
		await apollo.query<
			GetHostUserBanByIdQuery,
			GetHostUserBanByIdQueryVariables
		>({
			query: GetHostUserBanByIdDocument,
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
			variables: { id: String(currentUser.id) },
		})

	// Если пользователь забанен
	if (hostUserBanResult.hostUserBan) {
		return baseLayout(<UserBanLogin className='mt-24' />)
	}

	// Если пользователь авторизован и не забанен
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
			<div className='sticky bottom-0 lg:hidden'>
				<MobileButtonNavBar />
			</div>
		</>
	)
}
