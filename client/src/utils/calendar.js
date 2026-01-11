import { returnURL } from "./proxy";

export async function fetchCalendarData(calendarId = null) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    // Use calendarId if provided, else fetch the most recent calendar
    const url = calendarId != null || calendarId != undefined ? `${returnURL()}/api/calendar/${calendarId}` : `/api/calendar/`;

    const res = await fetch(url, {
        credentials: "include",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    console.log(res.ok, res.status);
    if (!res.ok) {
        throw new Error(`Failed to fetch calendar data: ${res.status}`);
    }

    const data = await res.json();
    return data;
}

export async function createCalendar(name, description, tasks) {
    console.log(name, description);
    console.log(tasks);
    console.log(JSON.stringify(tasks));
    const token = localStorage.getItem("token");
    const res = await fetch(`${returnURL()}/api/calendar/create`, {
        method: "POST",
        credentials: "include",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, tasks }),
    });
    if (!res.ok) {
        throw new Error("Failed to create calendar");
    }
    const data = await res.json();
    return data;
}

export async function fetchAllCalendarNames() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${returnURL()}/api/calendar/all/names`, {
        credentials: "include",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch calendar names");
    }
    const data = await res.json();
    return data;
}

export async function fetchAllCalendarIds() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${returnURL()}/api/calendar/all/ids`, {
        credentials: "include",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch calendar ids");
    }
    const data = await res.json();
    return data;
}

export const deleteCalendarById = async (calendarId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${returnURL()}/api/calendar/${calendarId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to delete calendar");
    }

    return res.json();
};
