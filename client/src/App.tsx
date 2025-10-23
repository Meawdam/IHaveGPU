import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./pages/admin/Layout";
import ClientLayout from "./pages/customer/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminHome from "./pages/admin/Home";
import AdminDashboard from "./pages/admin/Dashboard";
import ClientHome from "./pages/customer/Home";
import ProtectRoute from "./components/utility/protectRoute";
import { useSession } from "./components/utility/useSession";
import AdminNotFound from "./pages/admin/NotFound";
import ClientNotFound from "./pages/customer/NotFound";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminProduct from "./pages/admin/Product";
import ManageOrder from "./pages/admin/ManageOrder";
import ManageUser from "./pages/admin/ManageUser";
import ManageReviews from "./pages/admin/ManageReview";
import AdminSettings from "./pages/admin/Profile";
import ClientShop from "./pages/customer/Shop";
import ClientOrder from "./pages/customer/Order";
import Cart from "./pages/customer/Cart";
import Profile from "./pages/customer/Profile";
import Product from "./pages/customer/Product";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectRoute allowedRoles={["customer"]} />}>
          <Route element={<ClientLayout />}>
            <Route path="/home" element={<ClientHome />} />
            <Route path="/shop" element={<ClientShop />} />
            <Route path="/order" element={<ClientOrder />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shop/product/:id" element={<Product />} />
            <Route path="*" element={<ClientNotFound />} />
          </Route>
        </Route>

        <Route element={<ProtectRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="home" index element={<AdminHome />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="addProduct" element={<AddProduct />} />
            <Route path="editProduct/:id" element={<EditProduct />} />
            <Route path="product/:id" element={<AdminProduct />} />
            <Route path="order" element={<ManageOrder />} />
            <Route path="user" element={<ManageUser />} />
            <Route path="review" element={<ManageReviews />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<AdminNotFound />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
