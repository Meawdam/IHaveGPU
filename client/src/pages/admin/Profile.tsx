import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminSettings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        const resProfile = await axios.get("http://localhost:3000/profile", {
          withCredentials: true,
        });
        setUsername(resProfile.data.username);
        setEmail(resProfile.data.email);

        const resOrders = await axios.get("http://localhost:3000/admin/order-stats", {
          withCredentials: true,
        });

        setStats(resOrders.data);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Failed to fetch data",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    fetchProfileAndStats();
  }, []);

  const updateProfile = async () => {
    try {
      await axios.put(
        "http://localhost:3000/profile",
        { username, email },
        { withCredentials: true }
      );
      window.dispatchEvent(new CustomEvent("usernameUpdated", { detail: username }));

      Swal.fire({
        icon: "success",
        title: "Profile updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center pt-10 space-y-10">
      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-900">
          Admin Settings
        </h1>

        <div className="space-y-6">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <button
            onClick={updateProfile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
          >
            Update Profile
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
          <span className="text-gray-500 font-medium">Pending Orders</span>
          <span className="text-3xl font-bold text-yellow-500">{stats.pending}</span>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
          <span className="text-gray-500 font-medium">Completed Orders</span>
          <span className="text-3xl font-bold text-green-500">{stats.completed}</span>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
          <span className="text-gray-500 font-medium">Cancelled Orders</span>
          <span className="text-3xl font-bold text-red-500">{stats.cancelled}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;