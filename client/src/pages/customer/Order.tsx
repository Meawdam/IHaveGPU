import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

type OrderItem = {
  order_item_id: number;
  product_name: string;
  quantity: number;
  price: number;
};

type Order = {
  order_id: number;
  create_at: string;
  total_price: number;
  status: "pending" | "completed" | "cancelled";
  items: OrderItem[];
};

const UserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/orders", {
          withCredentials: true,
        });

        // แปลง total_price และ item.price เป็น number เผื่อ backend ส่ง string
        const formattedOrders = res.data.map((order: any) => ({
          ...order,
          total_price: Number(order.total_price),
          items: order.items.map((item: any) => ({
            ...item,
            price: Number(item.price),
          })),
        }));

        setOrders(formattedOrders);
      } catch (err: any) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: err.response?.data?.message || "Failed to fetch orders",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId: number) => {
    const confirm = await Swal.fire({
      title: "Cancel this order?",
      text: "You cannot undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(
          `http://localhost:3000/orders/${orderId}/cancel`,
          {},
          { withCredentials: true }
        );
        setOrders(
          orders.map((o) =>
            o.order_id === orderId ? { ...o, status: "cancelled" } : o
          )
        );
        Swal.fire("Cancelled!", "Your order has been cancelled.", "success");
      } catch (err: any) {
        Swal.fire(
          "Error!",
          err.response?.data?.message || "Cancel failed",
          "error"
        );
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6 text-center">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">You have no orders.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <p className="font-semibold">Order ID: {order.order_id}</p>
                <p className="text-gray-500 text-sm">
                  Date: {new Date(order.create_at).toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm">
                  Total: ฿{order.total_price.toFixed(2)}
                </p>
                <p
                  className={`mt-1 font-semibold ${
                    order.status === "pending"
                      ? "text-yellow-500"
                      : order.status === "completed"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  Status: {order.status}
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex gap-3">
                <button
                  onClick={() =>
                    Swal.fire({
                      title: "Order Details",
                      html: `<ul class="text-left">${order.items
                        .map(
                          (item) =>
                            `<li>${item.product_name} x ${item.quantity} - ฿${item.price.toFixed(
                              2
                            )}</li>`
                        )
                        .join("")}</ul>`,
                      icon: "info",
                    })
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Details
                </button>

                {order.status === "pending" && (
                  <button
                    onClick={() => cancelOrder(order.order_id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;