import { useEffect, useState } from "react";
import axios from "axios";

export const useSession = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user", {
          withCredentials: true,
        });

        if (res.status === 200 && res.data.loggedIn) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err: any) {
        setUser(null);
        if (err.response?.status !== 401) {
          setError(err.response?.data?.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return { user, loading, error };
};
