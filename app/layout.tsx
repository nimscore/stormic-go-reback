import { Header } from '@/components/header/header'
import { User } from '@/schema/types'
import { getSession } from '@/utils/auth/get-session'
import { Nunito } from 'next/font/google'
import React, { Suspense } from 'react'
import './globals.css'

const nunito = Nunito({
	subsets: ['cyrillic'],
	variable: '--font-nunito',
	weight: ['400', '500', '600', '700', '800', '900'],
})

export default async function HomeLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = (await getSession()) as { user: User } | null
	const currentUser = session && session.user
	console.log('currentUser:', currentUser)

	// Базовая разметка, которая будет использоваться в обоих случаях
	const baseLayout = (content: React.ReactNode) => (
		<html lang='en' suppressHydrationWarning>
			<head>
				{/* <link href='/favicon.ico' rel='icon' sizes='32x32' />
        <link href='/favicon.svg' rel='icon' type='image/svg+xml'/> */}
			</head>
			<body className={nunito.className}>
				<main className='min-h-screen'>{content}</main>
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
					<p>Ты не авторизован</p>
					{children}</div>
			</>
		)
	}

	return baseLayout(
		<>
			<Suspense>
				<Header currentUser={currentUser} />
			</Suspense>
			<div className='min-h-[calc(100vh-8rem)]'>
				<p>Ты авторизован</p>
				{children}</div>
		</>
	)
}
