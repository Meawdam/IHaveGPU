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
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/stats", {
          withCredentials: true,
        });
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const cardData = [
    { label: "Total Orders", value: stats.totalOrders, icon: <FaShoppingCart size={40} className="opacity-80" />, bg: "bg-blue-600" },
    { label: "Total Users", value: stats.totalUsers, icon: <FaUsers size={40} className="opacity-80" />, bg: "bg-green-600" },
    { label: "Total Products", value: stats.totalProducts, icon: <FaBox size={40} className="opacity-80" />, bg: "bg-yellow-500" },
    { label: "Total Revenue", value: `฿${stats.totalRevenue}`, icon: <FaMoneyBillWave size={40} className="opacity-80" />, bg: "bg-purple-600" },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold text-center mb-8">📊 Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card) => (
          <div key={card.label} className={`${card.bg} text-white rounded-2xl shadow p-6 flex items-center justify-between`}>
            <div>
              <p className="text-sm opacity-80">{card.label}</p>
              <h2 className="text-3xl font-bold">{card.value}</h2>
            </div>
            {card.icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
