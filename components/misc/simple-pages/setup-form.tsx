'use client'

import {
	RegisterSetupForm
} from '@/components/modals/auth-modal/forms/register-setup-form'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React from 'react'

// import { useIntl } from 'react-intl'

interface Props {
	className?: string
}

export const SetupForm: React.FC<Props> = ({
	                                           className
                                           }) => {
	const router = useRouter()
	// const { formatMessage } = useIntl()
	const [type, setType] = React.useState<
		'register' | 'settings'
	>('register')
	
	return (
		<div className={cn('flex gap-2', className)}>
			{/* Левая часть */}
			<div className='hidden lg:block lg:w-1/4 lg:h-[calc(100vh-6rem)] lg:overflow-auto lg:no-scrollbar'>
				
				{type === 'register' && (
					<RegisterSetupForm setType={setType} />
				)}
				{type === 'settings' && (
					<p>
						После настройки платформы, перейдите по ссылке в письме, чтобы подтвердить свою почту
					</p>
				)}
			</div>
			
			{/* Правая часть */}
			<div className='w-full lg:w-3/4 lg:h-[calc(100vh-6rem)] lg:overflow-auto lg:no-scrollbar rounded-xl'>
				{type === 'register' && (
					<p>
						Добро пожаловать
					</p>
				)}
				{type === 'settings' && (
					<p>
						Настройте платформу
					</p>
				)}
			</div>
		</div>
	)
}
