'use client'

import { verifyEmail } from '@/utils/auth/verify-email'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function VerifyEmailPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!token) {
			setError('Токен отсутствует')
			toast.error('Токен верификации отсутствует', { duration: 3000 })
			return
		}

		const verify = async () => {
			try {
				const result = await verifyEmail(token)
				toast.success(result.message || 'Почта успешно подтверждена!', {
					duration: 3000,
				})
				router.push('/')
			} catch (err: any) {
				const errorMessage = err.message || 'Не удалось подтвердить почту'
				setError(errorMessage)
				toast.error(errorMessage, { duration: 3000 })
			}
		}

		verify()
	}, [token, router])

	if (error) {
		return (
			<div className='max-w-md mx-auto py-8 text-center'>
				<h1 className='text-2xl font-bold text-foreground'>Ошибка</h1>
				<p className='text-red-500'>{error}</p>
				<a href='/' className='text-accent underline'>
					Вернуться на главную
				</a>
			</div>
		)
	}

	return (
		<div className='max-w-md mx-auto py-8 text-center'>
			<h1 className='text-2xl font-bold text-foreground'>
				Подтверждение почты
			</h1>
			<p>Пожалуйста, подождите, мы подтверждаем вашу почту...</p>
		</div>
	)
}
