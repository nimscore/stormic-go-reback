'use client'

import { AuthWatcher } from '@/utils/auth/auth-watcher'
import React from 'react'
import { Toaster } from '../components/ui/sonner'
import SessionProvider from './session'
import { ThemeProvider } from './theme'

export const Providers: React.FC<{
	children: React.ReactNode
	session: any
}> = ({ children, session }) => {
	return (
		<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
			<SessionProvider session={session}>
				{children}
				<AuthWatcher />
				<Toaster />
			</SessionProvider>
		</ThemeProvider>
	)
}
