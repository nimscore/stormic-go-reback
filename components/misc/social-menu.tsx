'use client'

import { GetHostSocialNavigationQuery } from '@/graphql/schema/graphql'
import { cn } from '@/lib/utils'
import { Github, Globe, Instagram, Send, Twitter } from 'lucide-react'
import Link from 'next/link'
import React, { JSX } from 'react'

interface Props {
	className?: string
	hostSocialNavigation: NonNullable<
		GetHostSocialNavigationQuery['hostSocialNavigation']
	>
}

export const SocialMenu: React.FC<Props> = ({
	className,
	hostSocialNavigation,
}) => {
	const socialMenu: {
		id: number
		icon: JSX.Element
		path: string
		name: string
	}[] = [
		{
			id: 1,
			icon: <Github size={24} />,
			path: hostSocialNavigation.github,
			name: 'GitHub',
		},
		{
			id: 2,
			icon: <Globe size={24} />,
			path: hostSocialNavigation.site,
			name: 'Сайт',
		},
		{
			id: 3,
			icon: <Send size={24} />,
			path: hostSocialNavigation.telegram,
			name: 'Telegram',
		},
		{
			id: 4,
			icon: <Instagram size={24} />,
			path: hostSocialNavigation.instagram,
			name: 'Instagram',
		},
		{
			id: 5,
			icon: <Twitter size={24} />,
			path: hostSocialNavigation.twitter,
			name: 'Twitter',
		},
		{
			id: 6,
			icon: (
				<img
					src='/icons/social/mastodon-icon.svg'
					alt='Mastodon icon'
					className='w-6 h-6 dark:filter dark:brightness-0 dark:invert'
				/>
			),
			path: hostSocialNavigation.mastodon,
			name: 'Mastodon',
		},
	].filter(
		(
			item
		): item is { id: number; icon: JSX.Element; path: string; name: string } =>
			item.path != null && item.path.trim() !== ''
	)

	return (
		<div className={cn('mt-2', className)}>
			<div className='flex gap-2 items-center px-2'>
				{socialMenu.length !== 0 &&
					socialMenu.map(item => (
						<Link
							key={item.id}
							href={item.path}
							target='_blank'
							className='group text-foreground hover:text-foreground hover:bg-secondary cursor-pointer rounded-xl items-center p-2 justify-center'
							title={item.name}
						>
							{item.icon}
						</Link>
					))}
			</div>
		</div>
	)
}
