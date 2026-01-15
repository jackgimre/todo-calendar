import { useState, useEffect } from 'react';
import { returnURL } from '../utils/proxy';

export default function useCurrentUser() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			const token = localStorage.getItem('token');
			if (!token) {
				setUser(null);
				setError('Not authenticated');
				setLoading(false);
				return;
			}

			try {
				const res = await fetch(`${returnURL()}/api/user/me/`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`
					}
				});

				const data = await res.json();

				if (!res.ok) {
					if (res.status === 401) {
						setUser(null);
						setError('Not authenticated');
					} else {
						throw new Error(data.error || 'Failed to fetch user');
					}
					return;
				}

				setUser(data.user || null);
			} catch (err) {
				setError(err.message);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	return { user, loading, error };
}
