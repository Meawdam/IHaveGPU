import { useEffect, useState } from "react";
import axios from "axios";
import { FaBox, FaUsers, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";

type Stats = {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
};

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/stats", {
          withCredentials: true,
        });
        setStats(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold text-center mb-8">📊 Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-blue-600 text-white rounded-2xl shadow p-6 flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Total Orders</p>
            <h2 className="text-3xl font-bold">{stats.totalOrders}</h2>
          </div>
          <FaShoppingCart size={40} className="opacity-80" />
        </div>

        <div className="bg-green-600 text-white rounded-2xl shadow p-6 flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Total Users</p>
            <h2 className="text-3xl font-bold">{stats.totalUsers}</h2>
          </div>
          <FaUsers size={40} className="opacity-80" />
        </div>

        <div className="bg-yellow-500 text-white rounded-2xl shadow p-6 flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Total Products</p>
            <h2 className="text-3xl font-bold">{stats.totalProducts}</h2>
          </div>
          <FaBox size={40} className="opacity-80" />
        </div>

        <div className="bg-purple-600 text-white rounded-2xl shadow p-6 flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Total Revenue</p>
            <h2 className="text-3xl font-bold">฿{stats.totalRevenue}</h2>
          </div>
          <FaMoneyBillWave size={40} className="opacity-80" />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
