'use client'

import { Button } from '@/components/ui/button'
import { GetCommunitiesQuery } from '@/graphql/schema/graphql'
import { cn } from '@/lib/utils'
import { Component } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Skeleton } from '../../ui/skeleton'
import { CommunitiesItem } from './community-item'

interface Props {
	communities: NonNullable<GetCommunitiesQuery['communities']>
	loading?: boolean
	limit?: number
	className?: string
}

export const CommunityForm: React.FC<Props> = ({
	communities,
	loading,
	limit,
	className,
}) => {
	const router = useRouter()
	const pathname = usePathname()

	const isActive = pathname === '/communities'

	if (loading) {
		return (
			<div className={cn('mt-2', className)}>
				<Button
					variant='secondary'
					type='button'
					className={cn(
						'flex gap-2 justify-start w-full mb-2 h-12 text-lg font-bold bg-transparent hover:bg-secondary text-foreground rounded-xl',
						pathname === `/communities` ? 'bg-secondary hover:bg-secondary' : ''
					)}
					onClick={() => router.push('/communities')}
				>
					<Component
						size={22}
						className={cn('text-foreground', isActive && 'text-theme')}
					/>
					Сообщества
				</Button>

				{[...Array(limit)].map((_, index) => (
					<Skeleton key={index} className='h-6 mb-4 rounded-[8px]' />
				))}

				<Skeleton className='w-28 h-6 mb-4 rounded-[8px]' />
			</div>
		)
	}

	return (
		<div className={cn('', className)}>
			<Button
				variant='secondary'
				type='button'
				className={cn(
					'flex gap-2 justify-start w-full mb-2 h-12 text-base font-medium bg-transparent hover:bg-secondary text-foreground rounded-xl',
					pathname === `/communities` ? 'bg-secondary hover:bg-secondary' : ''
				)}
				onClick={() => router.push('/communities')}
			>
				<Component
					size={22}
					className={cn('text-foreground', isActive && 'text-theme')}
				/>
				Сообщества
			</Button>
			{communities.slice(0, limit).map((item, index) => (
				<CommunitiesItem key={item.id} community={item} className='mb-2' />
			))}
		</div>
	)
}
