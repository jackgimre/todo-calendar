import { returnURL } from "./proxy";

export async function handleLogin(email, password) {
  try {
    const res = await fetch(`${returnURL()}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Login failed");

    // Store JWT (localStorage for now)
    localStorage.setItem("token", data.token);

    return { success: true, token: data.token };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function handleSignup(username, email, password) {
  try {
    const res = await fetch(`${returnURL()}/api/auth/signup`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Signup failed");

    // Optionally, login automatically after signup
    localStorage.setItem("token", data.token); // you could have backend return a JWT here

    return { success: true, userId: data.userId };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
