'use client'

import { UserResponse } from '@/graphql/schema/graphql'
import { createContext, useContext } from 'react'

const SessionContext = createContext<UserResponse | null>(null)

export default function SessionProvider({
	session,
	children,
}: {
	session: UserResponse
	children: React.ReactNode
}) {
	return (
		<SessionContext.Provider value={session}>
			{children}
		</SessionContext.Provider>
	)
}

export function useSession() {
	const session = useContext(SessionContext)
	return session
}
