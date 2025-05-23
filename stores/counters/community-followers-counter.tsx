import { cn } from '@/lib/utils'
import { useCommunityFollowStore } from '@/stores/community-follow-store'
import React, { useEffect } from 'react'

interface Props {
	communityId: string
	className?: string
}

export const CommunityFollowersCounter: React.FC<Props> = ({
	communityId,
	className,
}) => {
	const { initialize, followersCount } = useCommunityFollowStore()

	useEffect(() => {
		if (communityId !== undefined) {
			initialize(communityId)
		}
	}, [communityId, initialize])

	return (
		<div className={cn('', className)}>
			{communityId !== undefined ? followersCount[communityId] || 0 : 0}
		</div>
	)
}
