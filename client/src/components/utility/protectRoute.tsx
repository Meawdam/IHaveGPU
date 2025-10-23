import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "./useSession";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

type Props = {
  allowedRoles: string[];
};

const ProtectRoute = ({ allowedRoles }: Props) => {
  const { user, loading } = useSession();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <span className="ml-4 text-lg font-medium text-gray-600">
          Checking session...
        </span>
      </div>
    );

  if (!user) {
    Swal.fire({
      icon: "error",
      title: "Please login!!!",
      showConfirmButton: false,
      timer: 1500,
    });
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    Swal.fire({
      icon: "error",
      title: "Unauthorized",
      showConfirmButton: false,
      timer: 1500,
    });

    if (user.role === "customer") return <Navigate to="/home" replace />;
    if (user.role === "admin") return <Navigate to="/admin/home" replace />;
  }

  // 🔹 ผ่านการตรวจสอบ role
  return <Outlet />;
};

export default ProtectRoute;
