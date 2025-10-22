import AdminNavbar from "../../components/admin/AdminNavbar";
import Footer from "../../components/Footer";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;