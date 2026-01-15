import { returnURL } from './proxy';

/**
 * Login with email + password.
 * Stores JWT token in localStorage.
 */
export async function handleLogin(email, password) {
	try {
		const res = await fetch(`${returnURL()}/api/auth/login/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});

		const data = await res.json();

		if (!res.ok) {
			throw new Error(data.error || 'Login failed');
		}

		// Store token in localStorage
		localStorage.setItem('token', data.token);

		return { success: true, user: data.user };
	} catch (err) {
		return { success: false, error: err.message };
	}
}

/**
 * Signup.
 * Stores JWT token in localStorage.
 */
export async function handleSignup(username, email, password) {
	try {
		const res = await fetch(`${returnURL()}/api/auth/signup/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, email, password })
		});

		const data = await res.json();

		if (!res.ok) {
			throw new Error(data.error || 'Signup failed');
		}

		// Store token in localStorage
		localStorage.setItem('token', data.token);

		return { success: true, user: data.user };
	} catch (err) {
		return { success: false, error: err.message };
	}
}

/**
 * Logout by removing token from localStorage
 */
export function handleLogout() {
	localStorage.removeItem('token');
	return { success: true };
}

/**
 * Helper to get Authorization header
 */
export function getAuthHeader() {
	const token = localStorage.getItem('token');
	return token ? { Authorization: `Bearer ${token}` } : {};
}
