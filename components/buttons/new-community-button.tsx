'use client'

import { User } from '@/graphql/schema/graphql'
import { cn } from '@/lib/utils'
import { useSession } from '@/providers/session'
import React from 'react'
import { AuthModal } from '../modals/auth-modal/auth-modal'
import { NewCommunityModal } from '../modals/new-community'
import { Button } from '../ui/button'
// import { useIntl } from 'react-intl'

interface Props {
	logoImage: string
	stormicName: string
	authImage?: string
	className?: string
}

export const NewCommunityButton: React.FC<Props> = ({
	logoImage,
	authImage,
	stormicName,
	className,
}) => {
	const session = useSession()
	const currentUser = session && (session as User)

	// const { formatMessage } = useIntl()
	const [openCreateCommunityModal, setOpenCreateCommunityModal] =
		React.useState(false)
	const [openAuthModal, setOpenAuthModal] = React.useState(false)

	return (
		<div className={cn('', className)}>
			{currentUser ? (
				<NewCommunityModal
					userId={currentUser.id}
					open={openCreateCommunityModal}
					onClose={() => setOpenCreateCommunityModal(false)}
				/>
			) : (
				<AuthModal
					open={openAuthModal}
					onClose={() => setOpenAuthModal(false)}
					logoImage={logoImage || '/assets/host/logo.png'}
					authImage={authImage || '/assets/host/defaultBanner.jpg'}
					stormicName={stormicName || 'Stormic'}
				/>
			)}

			<Button
				variant='secondary'
				className='h-12 w-full text-lg font-medium rounded-xl text-background'
				type='button'
				onClick={
					currentUser
						? () => setOpenCreateCommunityModal(true)
						: () => setOpenAuthModal(true)
				}
			>
				Создать сообщество
			</Button>
		</div>
	)
}
