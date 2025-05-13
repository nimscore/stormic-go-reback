'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Component, Lightbulb, Newspaper, UsersRound } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

interface Props {
	className?: string
}

export const HeaderNavigation: React.FC<Props> = ({ className }) => {
	const router = useRouter()
	const pathname = usePathname()

	const HeaderButtonsArray = [
		{ id: 1, icon: <Newspaper size={24} />, path: '/', disabled: false },
		{
			id: 2,
			icon: <Component size={24} />,
			path: '/communities',
			disabled: false,
		},
		{
			id: 3,
			icon: <UsersRound size={24} />,
			path: '/users',
			disabled: false,
		},
		// { id: 4, icon: <LibraryBig size={24} />, path: '/wiki', disabled: true },
		{ id: 4, icon: <Lightbulb size={24} />, path: '/about', disabled: false },
	]

	return (
		<div className={className}>
			<div className='flex justify-evenly items-center'>
				{HeaderButtonsArray.map(item => (
					<Button
						key={item.id}
						variant='secondary'
						type='button'
						disabled={item.disabled}
						className={cn(
							'w-10 h-10 bg-transparent hover:bg-secondary text-foreground rounded-xl p-0',
							`${
								pathname === item.path
									? 'bg-secondary hover:bg-secondary text-theme'
									: ''
							}`
						)}
						onClick={() => router.push(item.path)}
					>
						{item.icon}
					</Button>
				))}
			</div>
		</div>
	)
}
