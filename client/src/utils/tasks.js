import { returnURL } from './proxy';

const toggleTaskCompletion = async (calendarId, index, day, month, year) => {
	const dateKey = `${year}-${month + 1}-${day}`;

	try {
		const response = await fetch(`${returnURL()}/api/tasks/toggle/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({ calendarId, index, dateKey })
		});

		const data = await response.json();

		if (response.ok) {
			console.log('Task toggled successfully:', data);
		} else {
			console.error('Error toggling task:', data.error);
		}

		return data;
	} catch (error) {
		console.error('Network error:', error);
		return error;
	}
};

export { toggleTaskCompletion };
