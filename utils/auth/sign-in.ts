export async function signIn(data: { email: string; password: string }) {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/users/login`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
				cache: 'no-store',
				credentials: 'include',
			}
		)
		
		if (!res.ok) {
			const errorData = await res.json()
			throw new Error(errorData.error || 'Login failed')
		}
		
		const result = await res.json();
		console.log('Server response body:', result);
		
		return { success: true }
	} catch (error) {
		throw error
	}
}
