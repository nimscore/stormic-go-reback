import { Header } from '@/components/header/header'
import { Providers } from '@/providers'
import { User } from '@/schema/types'
import { getSession } from '@/utils/auth/get-session'
import { gqlRequest } from '@/lib/graphql'
import { Nunito } from 'next/font/google'
import React, { Suspense } from 'react'
import './globals.css'

const nunito = Nunito({
	subsets: ['cyrillic'],
	variable: '--font-nunito',
	weight: ['400', '500', '600', '700', '800', '900'],
})

// GraphQL запрос для получения сообществ
const GET_COMMUNITIES_QUERY = `
  query GetCommunities {
    communities {
      id
      title
      communityHasBanned
    }
  }
`

const GET_USERS_QUERY = `
  query GetUsers {
  users {
    id
    name
    email
    createdAt
  }
}
`



export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = (await getSession()) as { user: User } | null
	const currentUser = session && session.user
	
	let communities: { id: string; title: string; communityHasBanned: boolean }[] = []
	let users: { id: string; name: string; email: string; avatar?: string; createdAt: string }[] = []
	
	try {
		const dataCommunities = await gqlRequest<{ communities: typeof communities }>(GET_COMMUNITIES_QUERY)
		communities = dataCommunities.communities
		console.log('Сообщества:', communities)
	} catch (error) {
		console.error('Ошибка при загрузке сообществ:', error)
	}
	
	try {
		const dataUsers = await gqlRequest<{ users: typeof users }>(GET_USERS_QUERY)
		users = dataUsers.users
		console.log('Пользователи:', users)
	} catch (error) {
		console.error('Ошибка при загрузке пользователей:', error)
	}

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
				<div className='min-h-[calc(100vh-8rem)]'>
					{children}
				</div>
			</>
		)
	}

	return baseLayout(
		<>
			<Suspense>
				<Header currentUser={currentUser} />
			</Suspense>
			<div className='min-h-[calc(100vh-8rem)]'>
				{children}
			</div>
		</>
	)
}
