'use client'

import {
	GetCommunityByIdQuery,
	GetHostQuery,
	User,
} from '@/graphql/schema/graphql'
import { cn } from '@/lib/utils'
import React from 'react'
import { AuthModal } from '../modals/auth-modal/auth-modal'
import { PostEditModal } from '../modals/post-edit'
import { Button } from '../ui/button'
// import { useIntl } from 'react-intl'

interface Props {
	host: NonNullable<GetHostQuery['host']>
	communities: NonNullable<GetCommunityByIdQuery['community']>[]
	currentUser?: User | null
	className?: string
}

export const NewPostButton: React.FC<Props> = ({
	host,
	communities,
	currentUser,
	className,
}) => {
	// const { formatMessage } = useIntl()
	const [openEditModal, setOpenEditModal] = React.useState(false)
	const [openAuthModal, setOpenAuthModal] = React.useState(false)

	return (
		<div className={cn('', className)}>
			{currentUser ? (
				<PostEditModal
					communities={communities}
					currentUser={currentUser}
					open={openEditModal}
					onClose={() => setOpenEditModal(false)}
				/>
			) : (
				<AuthModal
					open={openAuthModal}
					onClose={() => setOpenAuthModal(false)}
					logoImage={host.logo?.url || '/assets/host/logo.png'}
					authImage={host.authBanner?.url || '/assets/host/defaultBanner.jpg'}
					stormicName={host.title || 'Stormic'}
				/>
			)}

			<Button
				variant='secondary'
				className='text-base font-bold rounded-xl text-background'
				type='button'
				onClick={
					currentUser
						? () => setOpenEditModal(true)
						: () => setOpenAuthModal(true)
				}
			>
				{/* {formatMessage({ id: 'newPostButton' })} */}
				<span>Написать</span>
			</Button>
		</div>
	)
}
