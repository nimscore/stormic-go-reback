'use client'

import CommunityFollowButton from '@/components/buttons/community-follow-button'
import { ProfileAvatar } from '@/components/profiles/community-profile/profile-avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CommunityFollowersCounter } from '@/stores/counters/community-followers-counter'
import { CommunityPostsCounter } from '@/stores/counters/community-posts-counter'
import { truncateText } from '@/utils/textUtils'
import { Component, Newspaper, UserRoundPlus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

export interface Props {
	communityId: string
	title: string
	description: string | null | undefined
	communityUrl?: string
	logo?: string
	className?: string
}

export const CommunityCardItem: React.FC<Props> = ({
	communityId,
	logo,
	title,
	description,
	communityUrl,
	className,
}) => {
	const router = useRouter()

	return (
		<div className={cn('bg-secondary rounded-xl', className)}>
			<div className='h-full flex'>
				<div className='w-10/12 p-4'>
					<Link href={String(communityUrl)}>
						<div className='flex'>
							<div className='flex gap-4'>
								<ProfileAvatar
									className='w-16 h-16 border-none bg-secondary hover:bg-secondary'
									avatarImage={String(logo)}
									avatarSize={Number(64)}
								/>
								<div className='flex h-full my-auto'>
									<div>
										<p className='font-bold text-md text-foreground'>
											{truncateText(title, 14)}
										</p>
										<p className='mt-1 text-foreground'>
											{truncateText(description || '', 14)}
										</p>
									</div>
								</div>
							</div>
						</div>
					</Link>
					<div className='flex items-center border-t-2 border-t-primary/10 mt-4 w-full pt-3'>
						<div className='flex gap-8 w-1/2'>
							<div className='flex gap-2 items-center'>
								<CommunityPostsCounter communityId={communityId || ''} />
								<Newspaper size={20} />
							</div>
							<div className='flex gap-2 items-center'>
								<CommunityFollowersCounter communityId={communityId || ''} />
								<UserRoundPlus size={20} />
							</div>
						</div>
						<div className='flex justify-end w-1/2'>
							<CommunityFollowButton communityId={communityId} />
						</div>
					</div>
				</div>
				<div className='w-2/12 h-full  bg-primary/5 rounded-r-xl'>
					<div className='flex h-full rounded-r-xl bg-primary/5 items-center'>
						<Button
							variant='secondary'
							type='button'
							disabled={false}
							className='m-auto h-12 group hover:bg-secondary text-foreground rounded-xl'
							onClick={() => router.push(String(communityUrl))}
						>
							<Component size={22} className='group-hover:text-theme' />
						</Button>
					</div>
					{/* <div className='flex group w-full h-1/2 rounded-r-md'>
						<Button
							variant='secondary'
							type='button'
							disabled={true}
							className='h-14 w-14 m-auto text-primary rounded-full'
							// onClick={() => router.push(String(url))}
						>
							<Component />
						</Button>
					</div> */}
				</div>
			</div>
		</div>
	)
}
