import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

type User = {
  username: string;
  email: string;
};

type OrderItem = {
  order_item_id: number;
  product_name: string;
  quantity: number;
  price: number;
};

type Order = {
  order_id: number;
  total_price: number;
  items: OrderItem[];
};

const UserProfile = () => {
  const [user, setUser] = useState<User>({ username: "", email: "" });
  const [orders, setOrders] = useState<Order[]>([]);

  // อัปเดตโปรไฟล์
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

  // ดึงข้อมูลผู้ใช้และออร์เดอร์
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Profile */}
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md mb-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">My Profile</h1>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Username</label>
          <input
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <button
          onClick={updateProfile}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
        >
          Update Profile
        </button>
      </div>

      {/* Order History */}
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Order History</h2>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-700">Order #{order.order_id}</span>
                  <span className="text-yellow-500 font-bold">฿{order.total_price}</span>
                </div>

                <div className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <div key={item.order_item_id} className="py-2 flex justify-between text-gray-700">
                      <span>{item.product_name} x {item.quantity}</span>
                      <span>฿{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
