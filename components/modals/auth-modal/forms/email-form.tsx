'use client'

import { FormInput } from '@/components/form'
import { Title } from '@/components/misc/title'
import { Button } from '@/components/ui/button'
import { signIn } from '@/utils/auth/sign-in'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formLoginSchema, TFormLoginValues } from './schemas'

interface Props {
	onClose?: VoidFunction
	setType: React.Dispatch<
		React.SetStateAction<'login' | 'email' | 'register' | 'passwordReset'>
	>
}

export const EmailForm: React.FC<Props> = ({ setType, onClose }) => {
	const router = useRouter()
	const form = useForm<TFormLoginValues>({
		resolver: zodResolver(formLoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})
	
	const onSubmit = useCallback(
		async (data: TFormLoginValues) => {
			try {
				await signIn(data)
				toast.success('Вы успешно вошли в аккаунт', { icon: '✅' })
				onClose?.()
				router.refresh()
			} catch (error: any) {
				console.error('Error [LOGIN]', error)
				toast.error(error.message || 'Не удалось войти в аккаунт', {
					icon: '❌',
				})
			}
		},
		[router, onClose]
	)
	
	return (
		<FormProvider {...form}>
			<form
				className="lg:h-[78vh] flex flex-col gap-4 px-10 overflow-auto pb-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<Title
					text="Вход в аккаунт"
					size="md"
					className="font-bold text-foreground"
				/>
				<FormInput
					name="email"
					label="Почта"
					placeholder="user@stormic.app"
					className="bg-secondary text-foreground rounded-xl"
					required
				/>
				<FormInput
					name="password"
					label="Пароль"
					type="password"
					placeholder="********"
					className="bg-secondary text-foreground rounded-xl"
					required
				/>
				<Button
					variant="secondary"
					disabled={form.formState.isSubmitting}
					className="flex items-center gap-2 text-sm font-bold bg-secondary hover:bg-theme text-foreground hover:text-background rounded-xl"
					type="submit"
				>
					Войти
				</Button>
				<p className="text-gray-400 text-center">
					Нет аккаунта?{' '}
					<span
						className="text-theme cursor-pointer"
						onClick={() => setType('register')}
					>
                        Создать
                    </span>
				</p>
			</form>
		</FormProvider>
	)
}
