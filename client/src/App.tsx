import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./pages/admin/Layout";
import ClientLayout from "./pages/customer/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminHome from "./pages/admin/Home";
import ClientHome from "./pages/customer/Home";
import ProtectRoute from "./components/utility/protectRoute";
import { useSession } from "./components/utility/useSession";

const App = () => {
  const { user } = useSession();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectRoute allowedRoles={["customer"]} />}>
          <Route element={<ClientLayout />}>
            <Route path="/home" element={<ClientHome />} />
          </Route>
        </Route>


        <Route element={<ProtectRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
};

export default App;
