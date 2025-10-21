// src/components/utility/ProtectRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "./useSession";

type Props = {
  allowedRoles: string[];
};

const ProtectRoute = ({ allowedRoles }: Props) => {
  const { user, loading } = useSession();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ใช้ Outlet สำหรับ nested routes
  return <Outlet />;
};

export default ProtectRoute;
