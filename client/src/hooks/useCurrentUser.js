import { useState, useEffect } from "react";
import { returnURL } from "../utils/proxy";

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${returnURL()}/api/user/me`, {
          method: "GET",
          credentials: "include", // send cookies automatically
        });

        const data = await res.json(); // only call once

        if (!res.ok) {
          if (res.status === 401) {
            setUser(null);
            setError("Not authenticated");
          } else {
            throw new Error(data.error || "Failed to fetch user");
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
