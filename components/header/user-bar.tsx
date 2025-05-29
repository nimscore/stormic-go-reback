'use client'

import { ProfileButton } from '@/components/community-profile/profile-button'
import { AuthModal } from '@/components/modals/auth-modal/auth-modal'
import { Button } from '@/components/ui/button'
import {
	GetCommunityByIdQuery,
	GetHostQuery,
	UserResponse,
} from '@/graphql/schema/graphql'
// import { LocaleToggle } from '@/shared/components/ui/locale-toggle'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { NewPostButton } from '../buttons/new-post-button'

interface Props {
	hostSettings: NonNullable<GetHostQuery['host']>
	communities: NonNullable<GetCommunityByIdQuery['community']>[]
	currentUser?: UserResponse
	className?: string
}

export const HeaderUserBar: React.FC<Props> = ({
	hostSettings,
	communities,
	currentUser,
	className,
}) => {
	const [openAuthModal, setOpenAuthModal] = React.useState(false)
	const router = useRouter()

	return (
		<div
			className={cn(
				'flex items-center gap-3 lg:w-[250px] justify-end',
				className
			)}
		>
			<AuthModal
				open={openAuthModal}
				onClose={() => setOpenAuthModal(false)}
				logoImage={hostSettings.logo?.url || '/assets/host/logo.png'}
				authImage={
					hostSettings.authBanner?.url || '/assets/host/defaultBanner.jpg'
				}
				stormicName={hostSettings.title || 'Stormic'}
			/>

			{/* <LocaleToggle /> */}

			{/* <Notifications /> */}
			<Button
				variant='secondary'
				type='button'
				className={cn(
					'hidden lg:block w-10 h-10 bg-transparent hover:bg-secondary text-foreground rounded-xl p-0'
				)}
				onClick={() => router.push('/explore')}
			>
				<Search size={22} />
			</Button>

			<NewPostButton
				host={hostSettings}
				communities={communities}
				currentUser={currentUser !== null ? currentUser : undefined}
			/>

			<ProfileButton
				currentUser={currentUser}
				onClickSignIn={() => setOpenAuthModal(true)}
				className='hidden lg:block'
			/>
		</div>
	)
}
