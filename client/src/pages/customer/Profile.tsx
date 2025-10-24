import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaUserCircle,
  FaEnvelope,
  FaBox,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

type User = {
  username: string;
  email: string;
};

type Order = {
  order_id: number;
  total_price: number;
  status: "pending" | "completed" | "cancelled";
};

const UserProfile = () => {
  const [user, setUser] = useState<User>({ username: "", email: "" });
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  const updateProfile = async () => {
    try {
      await axios.put(
        "http://localhost:3000/profile",
        { username: user.username, email: user.email },
        { withCredentials: true }
      );

      window.dispatchEvent(
        new CustomEvent("usernameUpdated", { detail: user.username })
      );

      Swal.fire({
        icon: "success",
        title: "Profile updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: err.response?.data?.message || "",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await axios.get("http://localhost:3000/profile", {
          withCredentials: true,
        });
        setUser(resUser.data);

        const resOrders = await axios.get("http://localhost:3000/orders", {
          withCredentials: true,
        });
        setOrders(resOrders.data);

        // นับสถิติ
        const pending = resOrders.data.filter(
          (o: Order) => o.status === "pending"
        ).length;
        const completed = resOrders.data.filter(
          (o: Order) => o.status === "completed"
        ).length;
        const cancelled = resOrders.data.filter(
          (o: Order) => o.status === "cancelled"
        ).length;

        setStats({ pending, completed, cancelled });
      } catch (err: any) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Failed to fetch data",
          text: err.response?.data?.message || "",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 mb-10">
        <div className="flex flex-col items-center mb-8">
          <FaUserCircle className="text-blue-500 text-9xl mb-4" />
          <h1 className="text-4xl font-bold text-gray-800">{user.username}</h1>
          <p className="text-gray-500 flex items-center gap-2 mt-1">
            <FaEnvelope /> {user.email}
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-4 rounded-xl flex flex-col border border-gray-200">
            <label className="text-gray-500 text-sm mb-2">Username</label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
            />
          </div>

          <div className="p-4 rounded-xl flex flex-col border border-gray-200">
            <label className="text-gray-500 text-sm mb-2">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>

          <button
            onClick={updateProfile}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200"
          >
            Update Profile
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <FaHourglassHalf className="text-yellow-500 text-4xl mb-2" />
          <p className="text-gray-500">Pending</p>
          <p className="text-xl font-bold">{stats.pending}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <FaCheckCircle className="text-green-500 text-4xl mb-2" />
          <p className="text-gray-500">Completed</p>
          <p className="text-xl font-bold">{stats.completed}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <FaTimesCircle className="text-red-500 text-4xl mb-2" />
          <p className="text-gray-500">Cancelled</p>
          <p className="text-xl font-bold">{stats.cancelled}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
