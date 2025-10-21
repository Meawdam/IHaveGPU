// src/components/Layout/Navbar.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaShoppingCart,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const navigate = useNavigate();
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

      // redirect หลัง alert ปิด
      setTimeout(() => {
        navigate("/login");
      }, 1500);
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
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      <div className="text-2xl font-bold">IHaveGpu</div>

      <ul className="hidden md:flex space-x-6">
        <li>
          <Link to="/" className="hover:text-yellow-400">
            Home
          </Link>
        </li>
        <li>
          <Link to="/shop" className="hover:text-yellow-400">
            Shop
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-yellow-400">
            About
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-yellow-400">
            Contact
          </Link>
        </li>
      </ul>

      <div className="hidden md:block">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1 rounded text-black focus:outline-none"
        />
      </div>

      <div className="relative ml-4">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <FaUserCircle size={28} />
          <span className="hidden md:block">Meaw</span>
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
              onClick={() => logout()}
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
