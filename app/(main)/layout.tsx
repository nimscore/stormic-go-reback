import { Container } from '@/components'
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
	return (
		<>
			<Container className='lg:mt-4'>
				<div className='lg:flex lg:gap-2'>
					{/* Левая часть */}
					<div className='hidden lg:block lg:w-1/4 lg:h-[calc(100vh-6rem)] lg:overflow-auto lg:no-scrollbar'>
						<p>Левая часть</p>
					</div>
					{/* Центральная часть */}
					<div className='w-full lg:w-2/4 lg:h-[calc(100vh-6rem)] lg:overflow-auto lg:no-scrollbar lg:rounded-xl'>
						{children}
					</div>

					{/* Правая часть */}
					<div className='hidden lg:block lg:w-1/4 lg:h-[calc(100vh-6rem)] lg:overflow-auto lg:no-scrollbar lg:rounded-xl'>
						<p>Правая часть</p>
					</div>
				</div>
			</Container>
		</>
	)
}
