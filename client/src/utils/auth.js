import { returnURL } from './proxy';

/**
 * Login with email + password.
 * Backend sets HTTP-only cookie.
 * Frontend never sees or stores a token.
 */
export async function handleLogin(email, password) {
	try {
		const res = await fetch(`${returnURL()}/api/auth/login/`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});

		const data = await res.json();

		if (!res.ok) {
			throw new Error(data.error || 'Login failed');
		}

		// No token handling here at all
		return { success: true, user: data.user };
	} catch (err) {
		return { success: false, error: err.message };
	}
}

/**
 * Signup.
 * Backend should also set cookie so user is logged in immediately.
 */
export async function handleSignup(username, email, password) {
	try {
		const res = await fetch(`${returnURL()}/api/auth/signup/`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, email, password })
		});

		const data = await res.json();

		if (!res.ok) {
			throw new Error(data.error || 'Signup failed');
		}

		return { success: true, user: data.user };
	} catch (err) {
		return { success: false, error: err.message };
	}
}

/**
 * Logout by clearing cookie on backend
 */
export async function handleLogout() {
	try {
		const res = await fetch(`${returnURL()}/api/auth/logout/`, {
			method: 'POST',
			credentials: 'include'
		});

		if (!res.ok) {
			throw new Error('Logout failed');
		}

		return { success: true };
	} catch (err) {
		return { success: false, error: err.message };
	}
}
