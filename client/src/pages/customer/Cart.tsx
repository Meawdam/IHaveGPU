import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

type CartItem = {
  cart_id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image_url: string;
  stock: number;
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:3000/cart", {
          withCredentials: true,
        });
        setCartItems(res.data);
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: err.response?.data?.message || "Failed to fetch cart",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };
    fetchCart();
  }, []);

 const updateQuantity = async (cartId: number, qty: number, stock: number) => {
  if (qty < 1) return;
  if (qty > stock) {
    return Swal.fire("Warning", "Cannot exceed available stock", "warning");
  }

  try {
    await axios.put(
      `http://localhost:3000/cart/${cartId}`,
      { quantity: qty },
      { withCredentials: true }
    );
    setCartItems(
      cartItems.map((item) =>
        item.cart_id === cartId ? { ...item, quantity: qty } : item
      )
    );
  } catch (err: any) {
    Swal.fire(
      "Warning",
      err.response?.data?.message || "Failed to update",
      "warning"
    );
  }
};

  const removeItem = async (cartId: number) => {
    const result = await Swal.fire({
      title: "Remove item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/cart/${cartId}`, {
        withCredentials: true,
      });
      setCartItems(cartItems.filter((item) => item.cart_id !== cartId));
      Swal.fire("Removed!", "Item removed from cart", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to remove item", "error");
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const checkout = async () => {
    if (cartItems.length === 0) return Swal.fire("Cart is empty", "", "info");
    try {
      await axios.post(
        "http://localhost:3000/orders",
        { items: cartItems },
        { withCredentials: true }
      );
      Swal.fire("Success", "Order placed successfully", "success");
      setCartItems([]);
    } catch (err: any) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to place order",
        "error"
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6 text-center">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartItems.map((item) => (
            <div
              key={item.cart_id}
              className="bg-white shadow rounded-lg p-4 flex flex-col"
            >
              <img
                src={
                  item.image_url
                    ? `http://localhost:3000${item.image_url}`
                    : "https://via.placeholder.com/150"
                }
                alt={item.product_name}
                className="w-full h-full object-cover rounded mb-3"
              />
              <h2 className="text-lg font-semibold">{item.product_name}</h2>
              <p className="text-blue-600 font-bold mb-2">฿{item.price}</p>

              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() =>
                    updateQuantity(item.cart_id, item.quantity - 1, item.stock)
                  }
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.cart_id, item.quantity + 1, item.stock)
                  }
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.cart_id)}
                className="bg-red-600 text-white py-2 rounded hover:bg-red-700 transition mb-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-6 flex justify-end items-center gap-4">
          <p className="text-xl font-bold">Total: ฿{totalPrice}</p>
          <button
            onClick={checkout}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
