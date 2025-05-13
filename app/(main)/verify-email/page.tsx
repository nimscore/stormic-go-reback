'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VerifyEmailPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')
	const [error, setError] = useState<string | null>(null)
	
	useEffect(() => {
		if (!token) {
			setError('Токен отсутствует')
			return
		}
		
		const verifyEmail = async () => {
			console.log('token:', token)
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/auth/verify-email?token=${token}`,
					{
						method: 'GET',
						cache: 'no-store',
						credentials: 'include',
					}
				)
				
				if (!res.ok) {
					const errorData = await res.json()
					throw new Error(errorData.message || 'Ошибка верификации')
				}
				
				const data = await res.json()
				router.replace('/?verified')
			} catch (err: any) {
				setError(err.message || 'Не удалось подтвердить почту')
			}
		}
		
		verifyEmail()
	}, [token, router])
	
	if (error) {
		return (
			<div className="max-w-md mx-auto py-8 text-center">
				<h1 className="text-2xl font-bold text-foreground">Ошибка</h1>
				<p className="text-red-500">{error}</p>
				<a href="/" className="text-theme underline">
					Вернуться на главную
				</a>
			</div>
		)
	}
	
	return (
		<div className="max-w-md mx-auto py-8 text-center">
			<h1 className="text-2xl font-bold text-foreground">Подтверждение почты</h1>
			<p>Пожалуйста, подождите, мы подтверждаем вашу почту...</p>
		</div>
	)
}
