
import { useEffect, useState } from "react";
import { getProfile } from "../lib/api/api"; // API call to /auth/me

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    getProfile(token)
      .then((res) => {
        setUser(res.data); // contains _id, name, email, role
      })
      .catch((err) => {
        console.error("Auto-login failed:", err);
        localStorage.removeItem("token"); // invalid token
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
  };
}
