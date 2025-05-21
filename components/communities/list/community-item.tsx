'use client'

import { ProfileAvatar } from '@/components/profiles/community-profile/profile-avatar'
import { Button } from '@/components/ui/button'
import { GetCommunityByIdQuery } from '@/graphql/schema/graphql'
import { cn } from '@/lib/utils'
import { truncateText } from '@/utils/textUtils'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

export interface Props {
	community: NonNullable<GetCommunityByIdQuery['community']>
	className?: string
}

export const CommunitiesItem: React.FC<Props> = ({ community, className }) => {
	const router = useRouter()
	const pathname = usePathname()

	return (
		<div className={cn('', className)}>
			<Button
				variant='secondary'
				type='button'
				className={cn(
					'flex gap-2 justify-start w-full h-12 text-base font-medium bg-transparent hover:bg-secondary text-foreground rounded-xl',
					pathname === `/c/${community.slug}`
						? 'bg-secondary hover:bg-secondary'
						: ''
				)}
				onClick={() => router.push(`/c/${community.slug}`)}
			>
				<ProfileAvatar
					avatarImage={community.logo?.url || '/assets/host/logo.png'}
					className='hover:bg-transparent'
				/>
				{truncateText(community.title, 18)}
			</Button>
		</div>
	)
}
