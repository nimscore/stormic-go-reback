import { cn } from '@/lib/utils'
import { useFollowStore } from '@/stores/user-follow-store'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
// import { useIntl } from 'react-intl'

interface FollowButtonProps {
	userId: string
}

const UserFollowButton: React.FC<FollowButtonProps> = ({ userId }) => {
	// const { formatMessage } = useIntl()

	const { isFollowing, toggleFollow, initialize } = useFollowStore()
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		initialize(userId)
	}, [userId, initialize])

	const handleFollow = async () => {
		try {
			await toggleFollow(userId)
		} catch (error) {
			console.error('Failed to toggle follow:', error)
		}
	}

	// if (isLoading) {
	// 	return (
	// 		<Button variant='blue' type='submit' disabled>
	// 			Loading...
	// 		</Button>
	// 	)
	// }

	return (
		<Button
			variant='secondary'
			className={cn(
				'h-6 w-26 font-medium mt-auto mb-[2px] my-0 rounded-xl text-foreground hover:text-background bg-primary/10 hover:bg-theme-hover',
				isFollowing[userId] ? 'bg-theme/80 text-background' : ''
			)}
			type='button'
			onClick={handleFollow}
		>
			{isFollowing[userId] ? (
				// <>{formatMessage({ id: 'profileHeader.profileUnsubscribeButton' })}</>
				<>Отписаться</>
			) : (
				// <>{formatMessage({ id: 'profileHeader.profileSubscribeButton' })}</>
				<>Подписаться</>
			)}
		</Button>
	)
}

export default UserFollowButton
