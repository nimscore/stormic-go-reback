'use client'

import { FormInput } from '@/components/form'
import { Title } from '@/components/misc/title'
import { Button } from '@/components/ui/button'
import { registerUser } from '@/utils/auth/register'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
// import { useIntl } from 'react-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formRegisterSchema, TFormRegisterValues } from './schemas'

interface Props {
	setType: React.Dispatch<
		React.SetStateAction<'register' | 'settings'>
	>
}

export const RegisterSetupForm: React.FC<Props> = ({
	setType,
}) => {
	// const { formatMessage } = useIntl()
	const router = useRouter()
	const form = useForm<TFormRegisterValues>({
		resolver: zodResolver(formRegisterSchema),
		defaultValues: {
			email: '',
			fullName: '',
			password: '',
			confirmPassword: '',
		},
	})
	
	const onSubmit = useCallback(
		async (data: TFormRegisterValues) => {
			try {
				const result = await registerUser({
					email: data.email,
					name: data.fullName,
					password: data.password,
					confirmPassword: data.confirmPassword,
				})
				toast.success(result.message || 'Регистрация успешна', {
					icon: '✅',
				})
				router.refresh()
				setType('settings')
			} catch (error: any) {
				console.error('Error [REGISTER]', error)
				toast.error(error.message || 'Ошибка при регистрации', {
					icon: '❌',
				})
			}
		},
		[router]
	)

	return (
		<FormProvider {...form}>
			<form
				className='lg:h-[78vh] flex flex-col gap-4 px-10 overflow-auto pb-4'
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<Title
					// text={formatMessage({ id: 'loginForm.title' })}
					text='Регистрация'
					size='md'
					className='font-bold text-foreground'
				/>

				<FormInput
					name='email'
					// label={formatMessage({ id: 'registerForm.formInputEmailLabel' })}
					label='Почта'
					placeholder='user@stormic.app'
					className='bg-secondary text-foreground rounded-xl'
					required
				/>
				<FormInput
					name='fullName'
					// label={formatMessage({ id: 'registerForm.formInputNameLabel' })}
					label='Имя'
					placeholder='Stormhead'
					className='bg-secondary text-foreground rounded-xl'
					required
				/>
				<FormInput
					name='password'
					// label={formatMessage({ id: 'registerForm.formInputPassLabel' })}
					label='Пароль'
					type='password'
					placeholder='********'
					className='bg-secondary text-foreground rounded-xl'
					required
				/>
				<FormInput
					name='confirmPassword'
					// label={formatMessage({
					// 	id: 'registerForm.formInputConfirmPassLabel'
					// })}
					label='Подтвердите пароль'
					type='password'
					placeholder='********'
					className='bg-secondary text-foreground rounded-xl'
					required
				/>

				<Button
					variant='secondary'
					// loading={form.formState.isSubmitting}
					className='flex items-center gap-2 text-sm font-bold bg-secondary hover:bg-theme text-foreground hover:text-background rounded-xl'
					type='submit'
				>
					{/* {formatMessage({ id: 'registerForm.regButton' })} */}
					Создать
				</Button>
			</form>
		</FormProvider>
	)
}
