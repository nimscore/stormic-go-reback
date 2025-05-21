'use client'

import { GetHostSidebarNavigationQuery } from '@/graphql/schema/graphql'
import { cn } from '@/lib/utils'
import { truncateText } from '@/utils/textUtils'
import { Link2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'

interface Props {
	data: NonNullable<
		NonNullable<GetHostSidebarNavigationQuery['hostSidebarNavigation']>['items']
	>
	className?: string
}

export const NavigationMenuForm: React.FC<Props> = ({ data, className }) => {
	const router = useRouter()
	const pathname = usePathname()

	return (
		<div className={cn('', className)}>
			{data?.map(item => {
				const postId = item.post.id
				if (!postId) {
					return null
				}

				const isActive = pathname === `/p/${postId}`

				return (
					<Button
						key={item.id}
						variant='secondary'
						type='button'
						className={cn(
							'flex gap-2 justify-start w-full mt-2 h-12 text-base font-normal bg-transparent hover:bg-secondary text-foreground rounded-xl',
							pathname === `/p/${postId}`
								? 'bg-secondary hover:bg-secondary'
								: ''
						)}
						onClick={() => router.push(`/p/${postId}`)}
					>
						<Link2
							size={22}
							className={cn('text-foreground', isActive && 'text-theme')}
						/>
						<span>{truncateText(item.post.title, 24)}</span>
					</Button>
				)
			})}
		</div>
	)
}
