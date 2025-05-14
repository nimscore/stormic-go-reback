// import { useAuthStore } from '@/store/authStore';

export async function refreshToken(): Promise<boolean> {
	try {
		const res = await fetch('/v1/users/refresh-token', {
			method: 'POST',
			credentials: 'include', // Включаем куки
		})

		if (!res.ok) throw new Error('Token refresh failed')
		return true
	} catch (err) {
		console.error('[refreshToken] Error:', err)
		return false
	}
}

// export async function refreshToken(): Promise<boolean> {
//   const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();

//   if (!refreshToken) return false;

//   try {
//     const res = await fetch('/v1/users/refresh-token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ refreshToken }),
//     });

//     if (!res.ok) throw new Error('Token refresh failed');

//     const data = await res.json();
//     setTokens(data.accessToken, data.refreshToken);
//     return true;
//   } catch (err) {
//     console.error('[refreshToken] Error:', err);
//     clearTokens();
//     return false;
//   }
// }
