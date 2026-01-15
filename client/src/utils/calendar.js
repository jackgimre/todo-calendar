// src/utils/calendar.js
import { returnURL } from "./proxy";

const API_BASE = "/api/calendar";

/**
 * Safely handle fetch responses
 */
async function handleResponse(res) {
  if (!res.ok) {
    let message = "Request failed";
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
  const res = await fetch(`${returnURL()}/api/user/me/calendars`, {
    method: "GET",
    credentials: "include",
    signal
  });

  return handleResponse(res);
}

/**
 * Fetch a single calendar by ID
 */
export async function fetchCalendarData(calendarId) {
  if (!calendarId) {
    throw new Error("Calendar ID is required");
  }

  const res = await fetch(`${returnURL()}/api/calendar/id/${calendarId}`, {
    method: "GET",
    credentials: "include"
  });

  if (!res.ok) {
    let errorMsg = "Failed to fetch calendar";
    try {
      const errData = await res.json();
      errorMsg = errData.error || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}

/**
 * Create a new calendar
 */
export async function createCalendar(name, description, tasks) {
  const res = await fetch(`${returnURL()}/api/calendar/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name,
      description,
      tasks
    })
  });

  return handleResponse(res);
}

/**
 * Delete a calendar by ID
 */
export async function deleteCalendarById(calendarId) {
  if (!calendarId) {
    throw new Error("Calendar ID is required");
  }

  const res = await fetch(`${returnURL()}/api/calendar/id/${calendarId}`, {
    method: "DELETE",
    credentials: "include"
  });

  return handleResponse(res);
}
