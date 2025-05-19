import { Header } from '@/components/header/header'
import { GetUsersQuery } from '@/graphql/generated/graphql'
import { apolloClient } from '@/lib/apollo-client'
import { Providers } from '@/providers'
import { User } from '@/schema/types'
import { getSession } from '@/utils/auth/get-session'
import { gql } from '@apollo/client'
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

const GET_COMMUNITIES = gql`
	query GetCommunities {
		communities {
			id
			title
			communityHasBanned
		}
	}
`

const GET_USERS = gql`
	query GetUsers {
		users {
			id
			name
			email
			hostRoles {
				name
				color
			}
			createdAt
		}
	}
`

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const counterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA
	const session = (await getSession()) as { user: User } | null
	const currentUser = session && session.user
	const apollo = apolloClient()

	// const { data, loading, error } = useQuery(GET_COMMUNITIES)
	const { data } = await apollo.query<GetUsersQuery>({
		query: GET_USERS,
		fetchPolicy: 'network-only',
	})

	console.log('Пользователи:', data.users)

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
					<Header />
				</Suspense>
				<div className='min-h-[calc(100vh-8rem)]'>{children}</div>
			</>
		)
	}

	return baseLayout(
		<>
			<Suspense>
				<Header currentUser={currentUser} />
			</Suspense>
			<div className='min-h-[calc(100vh-8rem)]'>{children}</div>
		</>
	)
}
