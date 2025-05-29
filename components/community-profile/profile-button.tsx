'use client'

import { ModeToggle } from '@/components/misc/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserResponse } from '@/graphql/schema/graphql'
import { signOut } from '@/utils/auth/sign-out'
import { CircleUser, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface Props {
	currentUser?: UserResponse
	onClickSignIn: () => void
	className?: string
}

export const ProfileButton: React.FC<Props> = ({
	currentUser,
	onClickSignIn,
	className,
}) => {
	const router = useRouter()
	const [dropdownKey, setDropdownKey] = useState(Date.now()) // Уникальный ключ для DropdownMenu

	const handleSignOut = useCallback(async () => {
		try {
			await signOut()
			toast.success('✅ Вы успешно вышли из аккаунта!', {
				duration: 3000,
			})
			router.refresh()
		} catch (error: any) {
			toast.error('❌ Ошибка при выходе из аккаунта!', {
				duration: 3000,
			})
		}
	}, [router])

	const handleSignInClick = () => {
		if (onClickSignIn) {
			onClickSignIn()
			setDropdownKey(Date.now())
		}
	}

	return (
		<div className={className}>
			{!currentUser ? (
				<DropdownMenu key={dropdownKey}>
					<DropdownMenuTrigger asChild>
						<CircleUser
							size={40}
							className='cursor-pointer text-foreground hover:text-theme p-1 bg-transparent hover:bg-secondary rounded-full'
						/>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='bg-secondary'>
						<DropdownMenuItem className='flex justify-between gap-2'>
							<span className='text-foreground text-base'>Оформление</span>
							<ModeToggle />
						</DropdownMenuItem>
						<DropdownMenuItem
							className='flex cursor-pointer gap-2'
							onClick={handleSignInClick}
						>
							<LogIn size={22} />
							<span className='text-foreground text-base'>Войти</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<DropdownMenu key={dropdownKey}>
					<DropdownMenuTrigger asChild>
						<Avatar className='border-2 border-transparent rounded-full cursor-pointer hover:border-theme'>
							<AvatarImage
								className='m-auto rounded-full'
								src='/assets/host/logo.png'
							/>
							<AvatarFallback>
								<CircleUser />
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='bg-secondary'>
						<DropdownMenuItem
							className='cursor-pointer text-foreground text-base'
							onClick={() => router.push(`/u/${currentUser.id}`)}
						>
							Профиль
						</DropdownMenuItem>
						<DropdownMenuItem
							className='cursor-pointer text-foreground text-base'
							onClick={() => router.push(`/u/${currentUser.id}/drafts`)}
						>
							Черновики
						</DropdownMenuItem>
						<DropdownMenuItem
							className='cursor-pointer text-foreground text-base'
							onClick={() => router.push('/settings/user/profile')}
						>
							Настройки
						</DropdownMenuItem>
						<DropdownMenuItem className='flex justify-between gap-2 text-foreground text-base'>
							<span>Оформление</span>
							<ModeToggle />
						</DropdownMenuItem>
						<DropdownMenuItem
							className='cursor-pointer text-foreground text-base'
							onClick={handleSignOut}
						>
							Выйти
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	)
}
