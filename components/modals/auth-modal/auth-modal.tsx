'use client'

import { EmailForm } from '@/components/modals/auth-modal/forms/email-form'
import { LoginForm } from '@/components/modals/auth-modal/forms/login-form'
import { RegisterForm } from '@/components/modals/auth-modal/forms/register-form'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'
// import { useIntl } from 'react-intl'

interface Props {
	stormicName?: string
	logoImage?: string
	authImage?: string
	open: boolean
	onClose: () => void
}

export const AuthModal: React.FC<Props> = ({
	stormicName,
	logoImage,
	authImage,
	open,
	onClose,
}) => {
	// const { formatMessage } = useIntl()
	const [type, setType] = React.useState<
		'login' | 'email' | 'register' | 'passwordReset'
	>('login')

	const handleClose = () => {
		onClose()
	}

	const isMobile = useIsMobile()

	if (!isMobile) {
		return (
			<Dialog open={open} onOpenChange={handleClose}>
				<DialogContent className='lg:min-w-[43vw] lg:h-[78vh] p-0 rounded-xl'>
					<DialogHeader className='hidden'>
						<DialogTitle />
					</DialogHeader>
					<div className='flex w-full h-full'>
						<div className='hidden lg:block lg:w-2/5 h-full'>
							<img
								className='rounded-l-md h-full object-cover'
								src={authImage}
								alt={stormicName}
							/>
							<img
								className='absolute left-2 top-2 rounded-full'
								src={logoImage}
								alt={stormicName}
								height='54'
								width='54'
							/>
						</div>
						<div className='w-full lg:w-3/5 h-full'>
							<div className='w-full h-full'>
								{type === 'login' && (
									<LoginForm onClose={handleClose} setType={setType} />
								)}
								{type === 'email' && (
									<EmailForm onClose={handleClose} setType={setType} />
								)}
								{type === 'register' && (
									<RegisterForm onClose={handleClose} setType={setType} />
								)}
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		)
	}
	return (
		<Drawer open={open} onOpenChange={handleClose}>
			<DrawerContent className='lg:min-w-[43vw] lg:h-[78vh] p-0 rounded-xl'>
				<DrawerHeader className='hidden'>
					<DrawerTitle />
				</DrawerHeader>
				<div className='flex w-full h-full'>
					<div className='hidden lg:block lg:w-2/5 h-full'>
						<img
							className='rounded-l-md h-full object-cover'
							src={authImage}
							alt={stormicName}
						/>
						<img
							className='absolute left-2 top-2 rounded-full'
							src={logoImage}
							alt={stormicName}
							height='54'
							width='54'
						/>
					</div>
					<div className='w-full lg:w-3/5 h-full'>
						<div className='w-full h-full'>
							{type === 'login' && (
								<LoginForm onClose={handleClose} setType={setType} />
							)}
							{type === 'email' && (
								<EmailForm onClose={handleClose} setType={setType} />
							)}
							{type === 'register' && (
								<RegisterForm onClose={handleClose} setType={setType} />
							)}
						</div>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	)
}
