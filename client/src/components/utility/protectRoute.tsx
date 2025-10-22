import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "./useSession";
import Swal from "sweetalert2";

type Props = {
  allowedRoles: string[];
};

const ProtectRoute = ({ allowedRoles }: Props) => {
  const { user, loading } = useSession();

  if (loading) return <div>Loading...</div>;

  if (!user){
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
          if(user.role == "customer") return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectRoute;
