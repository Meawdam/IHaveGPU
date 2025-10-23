// src/components/Layout/Navbar.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaShoppingCart,
  FaHistory,
  FaSignOutAlt,
  FaUsers,
  FaStar,
  FaCog,
} from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user", { withCredentials: true });
        setUsername(res.data.user.username);
      } catch (err: any) {
        Swal.fire({ icon: "error", title: "Fetch error", showConfirmButton: false, timer: 1500 });
      }
    };
    fetchData();

    const handleUsernameUpdate = (e: any) => setUsername(e.detail);
    window.addEventListener("usernameUpdated", handleUsernameUpdate);

    return () => window.removeEventListener("usernameUpdated", handleUsernameUpdate);
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/logout",
        {},
        { withCredentials: true }
      );

      Swal.fire({
        icon: "success",
        title: "Logged out!",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Logout failed",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="text-2xl font-bold">
        <Link to="/admin/home">IHaveGpu</Link>
      </div>

      <ul className="hidden md:flex space-x-6 text-sm font-medium">
        <li>
          <Link to="/admin/home" className="hover:text-yellow-400">
            Home
          </Link>
        </li>
        <li>
          <Link to="/admin/dashboard" className="hover:text-yellow-400">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/order" className="hover:text-yellow-400">
            Orders
          </Link>
        </li>
        <li>
          <Link to="/admin/user" className="hover:text-yellow-400 flex items-center gap-1">
            <FaUsers /> Users
          </Link>
        </li>
        <li>
          <Link to="/admin/review" className="hover:text-yellow-400 flex items-center gap-1">
            <FaStar /> Reviews
          </Link>
        </li>
        <li>
          <Link to="/admin/settings" className="hover:text-yellow-400 flex items-center gap-1">
            <FaCog /> Settings
          </Link>
        </li>
      </ul>

      <div className="relative ml-4">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <FaUserCircle size={28} />
          <span className="hidden md:block">{username || "Loading..."}</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 hover:bg-gray-200"
            >
              <FaUserCircle className="mr-2" /> Profile
            </Link>
            <Link
              to="/cart"
              className="flex items-center px-4 py-2 hover:bg-gray-200"
            >
              <FaShoppingCart className="mr-2" /> Cart
            </Link>
            <Link
              to="/history"
              className="flex items-center px-4 py-2 hover:bg-gray-200"
            >
              <FaHistory className="mr-2" /> History
            </Link>
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 w-full hover:bg-gray-200"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
