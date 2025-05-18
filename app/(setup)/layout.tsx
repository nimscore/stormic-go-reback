import { Container } from '@/components/misc/container'
import {
	RegisterForm
} from '@/components/modals/auth-modal/forms/register-form'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
	title: 'Stormic: Начальная настройка'
}

export default async function SetupLayout({
	                                                children
                                                }: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<Container className='mt-2'>
				{children}
			</Container>
		</>
	)
}
