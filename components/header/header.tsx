'use client'

import { Container } from '@/components/misc/container'
import { cn } from '@/lib/utils'
import { User } from '@/schema/types'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { HeaderNavigation } from './navigation'
import { HeaderUserBar } from './user-bar'

interface Props {
	currentUser?: User
	className?: string
}

export const Header: React.FC<Props> = ({ currentUser, className }) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()

	// Функция для извлечения communityId из пути
	const getCommunityIdFromPath = (path: string | null): string | undefined => {
		if (!path) return undefined
		const match = path.match(/^\/settings\/community\/([^/]+)(\/|$)/)
		return match ? match[1] : undefined
	}

	const communityId = getCommunityIdFromPath(pathname)

	return (
		<header
			className={cn(
				'sticky top-0 pt-2 z-10 bg-background lg:mx-0 lg:pt-0 lg:bg-transparent lg:border-b lg:border-primary/5',
				className
			)}
		>
			<Container>
				<div className='flex items-center justify-between h-[4rem] mx-2 lg:mx-0 bg-secondary lg:bg-transparent border-b border-primary/5 lg:border-none rounded-xl lg:rounded-none'>
					{/* Левая часть */}
					<div className='w-1/2 lg:w-1/4 flex items-center'>
						<Link href='/'>
							<div className='flex items-center gap-2 lg:gap-4 w-full lg:w-[250px]'>
								<img
									src='/assets/host/logo.png'
									alt='Logo'
									width={42}
									height={42}
								/>
								<div>
									<h1 className='text-2xl uppercase font-black text-foreground'>
										{'Stormic'}
									</h1>
									{'код, GitHub и ты'}
								</div>
							</div>
						</Link>
					</div>

					{/* Центральная */}
					<div className='hidden lg:block lg:w-2/4'>
						<HeaderNavigation className='w-full' />
					</div>

					{/* Правая часть */}
					<div className='flex items-center w-1/2 lg:w-1/4 gap-3 justify-end'>
						<HeaderUserBar currentUser={currentUser} className='mr-2 lg:mr-0' />
					</div>
				</div>
			</Container>
		</header>
	)
}
