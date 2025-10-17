// useSession.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export const useSession = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user", {
          withCredentials: true,
        });

        if (res.status === 200 && res.data.loggedIn) {
          Swal.fire({
            icon: "info",
            title: "You're already logged in",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate("/home");
          });
        }
      } catch (error: any) {
        if (error.response?.status !== 401) {
          Swal.fire({
            icon: "error",
            title: error.response?.data?.message || "Something went wrong",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    };

    checkSession();
  }, [navigate]);
};
