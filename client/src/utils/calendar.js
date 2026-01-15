import { returnURL } from './proxy';

/**
 * Get Authorization header from token
 */
function getAuthHeader() {
	const token = localStorage.getItem('token');
	return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Safely handle fetch responses
 */
async function handleResponse(res) {
	if (!res.ok) {
		let message = 'Request failed';
		try {
			const data = await res.json();
			message = data.error || message;
		} catch {}
		throw new Error(message);
	}
	return res.json();
}

/**
 * Fetch all calendars for the current user
 */
export async function fetchAllCalendars({ signal } = {}) {
	const res = await fetch(`${returnURL()}/api/user/me/calendars/`, {
		method: 'GET',
		headers: { ...getAuthHeader() },
		signal
	});

	return handleResponse(res);
}

/**
 * Fetch a single calendar by ID
 */
export async function fetchCalendarData(calendarId) {
	if (!calendarId) throw new Error('Calendar ID is required');

	const res = await fetch(`${returnURL()}/api/calendar/id/${calendarId}/`, {
		method: 'GET',
		headers: { ...getAuthHeader() }
	});

	return handleResponse(res);
}

/**
 * Create a new calendar
 */
export async function createCalendar(name, description, tasks) {
	const res = await fetch(`${returnURL()}/api/calendar/create/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...getAuthHeader()
		},
		body: JSON.stringify({ name, description, tasks })
	});

	return handleResponse(res);
}

/**
 * Delete a calendar by ID
 */
export async function deleteCalendarById(calendarId) {
	if (!calendarId) throw new Error('Calendar ID is required');

	const res = await fetch(`${returnURL()}/api/calendar/id/${calendarId}/`, {
		method: 'DELETE',
		headers: { ...getAuthHeader() }
	});

	return handleResponse(res);
}
