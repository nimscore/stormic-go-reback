export async function registerUser(data: {
	email: string
	name: string
	password: string
	confirmPassword?: string
}) {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/users/register`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: data.name,
					email: data.email,
					password: data.password,
				}),
				cache: 'no-store',
			}
		)

		if (!res.ok) {
			const errorData = await res.json()
			throw new Error(errorData.error || 'Registration failed')
		}

		const response = await res.json()
		// После успешной регистрации выполняем вход
		// await signIn({ email: data.email, password: data.password })

		return { success: true, message: response.message }
	} catch (error) {
		throw error
	}
}
