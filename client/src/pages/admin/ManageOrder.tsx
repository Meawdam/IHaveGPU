import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";

type OrderItem = {
  order_item_id: number;
  product_name: string;
  quantity: number;
  price: number;
};

type Order = {
  order_id: number;
  user_id: number;
  username: string;
  create_at: string;
  total_price: string | number;
  status: string;
  items: OrderItem[];
};

const ManageOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/orders", {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showOrderDetails = (order: Order) => {
    const itemsHtml = order.items
      .map(
        (item) =>
          `<li class="border-b py-1">${item.product_name} × ${item.quantity} — ฿${Number(
            item.price
          ).toFixed(2)}</li>`
      )
      .join("");

    Swal.fire({
      title: `Order #${order.order_id} Details`,
      html: `
        <div class="text-left">
          <p><b>User:</b> ${order.username}</p>
          <p><b>Date:</b> ${new Date(order.create_at).toLocaleString()}</p>
          <p><b>Status:</b> ${order.status}</p>
          <hr class="my-2">
          <p><b>Items:</b></p>
          <ul>${itemsHtml}</ul>
          <hr class="my-2">
          <p class="font-semibold">Total: ฿${Number(order.total_price).toFixed(
            2
          )}</p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  const updateStatus = async (order_id: number, newStatus: string) => {
    try {
      await axios.put(
        `http://localhost:3000/orders/${order_id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      Swal.fire({
        icon: "success",
        title: `Order #${order_id} marked as ${newStatus}`,
        showConfirmButton: false,
        timer: 1500,
      });
      fetchOrders();
    } catch {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const deleteOrder = async (order_id: number) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This will permanently delete the order!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/orders/${order_id}`, {
        withCredentials: true,
      });
      Swal.fire("Deleted", "Order deleted successfully", "success");
      fetchOrders();
    } catch {
      Swal.fire("Error", "Failed to delete order", "error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="flex flex-col items-center mt-10 text-gray-600">
        <FaBox size={40} className="mb-2" />
        <p>No orders found</p>
      </div>
    );

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isFinal =
                order.status === "completed" || order.status === "cancelled";

              return (
                <tr
                  key={order.order_id}
                  className={`border-t hover:bg-gray-50 transition ${
                    isFinal ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <td className="p-3 font-medium">#{order.order_id}</td>
                  <td className="p-3">{order.username}</td>
                  <td className="p-3 text-gray-600">
                    {new Date(order.create_at).toLocaleString()}
                  </td>
                  <td className="p-3 font-semibold text-gray-800">
                    ฿{Number(order.total_price).toFixed(2)}
                  </td>
                  <td className="p-3 flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </td>
                  <td className="p-3 flex justify-center space-x-2">
                    {/* ✅ ปุ่มดูรายละเอียด */}
                    <button
                      onClick={() => showOrderDetails(order)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center"
                    >
                      <FaInfoCircle className="mr-1" /> Details
                    </button>

                    <button
                      onClick={() =>
                        !isFinal && updateStatus(order.order_id, "completed")
                      }
                      disabled={isFinal}
                      className={`px-3 py-1 rounded text-sm text-white ${
                        isFinal
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      Complete
                    </button>

                    <button
                      onClick={() =>
                        !isFinal && updateStatus(order.order_id, "cancelled")
                      }
                      disabled={isFinal}
                      className={`px-3 py-1 rounded text-sm text-white ${
                        isFinal
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => !isFinal && deleteOrder(order.order_id)}
                      disabled={isFinal}
                      className={`px-3 py-1 rounded text-sm flex items-center text-white ${
                        isFinal
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
