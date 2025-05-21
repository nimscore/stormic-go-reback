'use client'

import { cn } from '@/lib/utils'
import { BookmarkCheck, CheckCheck, Compass, Flame, Zap } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'

// import { useIntl } from 'react-intl'

interface Props {
	className?: string
}

export const FeedUserMenu: React.FC<Props> = ({ className }) => {
	// const { formatMessage } = useIntl()
	const pathname = usePathname()
	const router = useRouter()

	const userMenu = [
		{
			id: 1,
			text: 'Популярное',
			icon: (isActive: boolean) => (
				<Flame
					size={22}
					className={cn('text-foreground', isActive && 'text-theme')}
				/>
			),
			path: '/',
			disabled: true,
		},
		{
			id: 2,
			text: 'Свежее',
			icon: (isActive: boolean) => (
				<Zap
					size={22}
					className={cn('text-foreground', isActive && 'text-theme')}
				/>
			),
			path: '/new',
			disabled: false,
		},
		{
			id: 3,
			text: 'Моя Лента',
			icon: (isActive: boolean) => (
				<CheckCheck
					size={22}
					className={cn('text-foreground', isActive && 'text-theme')}
				/>
			),
			path: '/my',
			disabled: false,
		},
		{
			id: 4,
			text: 'Закладки',
			icon: (isActive: boolean) => (
				<BookmarkCheck
					size={22}
					className={cn('text-foreground', isActive && 'text-theme')}
				/>
			),
			path: '/bookmarks',
			disabled: false,
		},
		{
			id: 5,
			text: 'Обзор',
			icon: (isActive: boolean) => (
				<Compass
					size={22}
					className={cn('text-foreground', isActive && 'text-theme')}
				/>
			),
			path: '/explore',
			disabled: false,
		},
	]

	return (
		<div className={cn('', className)}>
			{userMenu.map(item => {
				const isActive = pathname === item.path
				return (
					<Button
						key={item.id}
						variant='secondary'
						type='button'
						disabled={item.disabled}
						className={cn(
							'flex gap-2 justify-start w-full mb-2 h-12 text-base font-medium bg-transparent hover:bg-secondary text-foreground rounded-xl',
							isActive && 'bg-secondary hover:bg-secondary'
						)}
						onClick={() => router.push(item.path)}
					>
						{typeof item.icon === 'function' ? item.icon(isActive) : item.icon}
						{item.text}
					</Button>
				)
			})}
		</div>
	)
}
