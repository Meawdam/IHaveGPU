import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UserProfile = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any>({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

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

        const reviewsObj: any = {};
        for (const order of resOrders.data) {
          for (const item of order.items) {
            const res = await axios.get(
              `http://localhost:3000/reviews?product_id=${item.product_id}`
            );
            reviewsObj[item.product_id] = res.data;
          }
        }
        setReviews(reviewsObj);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Failed to fetch data",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    };
    fetchData();
  }, []);

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
  
  const submitReview = async (
    product_id: number,
    rating: number,
    comment: string
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/reviews",
        {
          product_id,
          rating,
          comment,
        },
        { withCredentials: true }
      );

      setReviews({
        ...reviews,
        [product_id]: [res.data, ...(reviews[product_id] || [])],
      });
      Swal.fire({
        icon: "success",
        title: "Review added",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to add review",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mb-8">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <label className="block mb-1 font-medium">Username</label>
        <input
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          className="w-full p-2 border rounded-md mb-4"
        />
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="w-full p-2 border rounded-md mb-4"
        />
        <button
          onClick={updateProfile}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-md"
        >
          Update
        </button>
      </div>

      <div className="w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4">Order History & Reviews</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div
                key={order.order_id}
                className="bg-white p-4 rounded-lg shadow"
              >
                <div className="flex justify-between mb-2">
                  <span>Order #{order.order_id}</span>
                  <span className="font-bold">฿{order.total_price}</span>
                </div>

                {order.items.map((item: any) => (
                  <div key={item.order_item_id} className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>
                        {item.product_name} x {item.quantity}
                      </span>
                      <span>฿{item.price}</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm">Reviews:</h3>
                      {(reviews[item.product_id] || []).map((r: any) => (
                        <div
                          key={r.review_id}
                          className="text-sm text-gray-700"
                        >
                          ⭐ {r.rating} - {r.comment}{" "}
                          <span className="text-gray-400">by {r.username}</span>
                        </div>
                      ))}

                      <div className="flex gap-2 mt-2">
                        <input
                          type="number"
                          placeholder="Rating 1-5"
                          min={1}
                          max={5}
                          className="w-20 p-1 border rounded"
                          id={`rating-${item.product_id}`}
                        />
                        <input
                          type="text"
                          placeholder="Write a comment"
                          className="flex-1 p-1 border rounded"
                          id={`comment-${item.product_id}`}
                        />
                        <button
                          onClick={() => {
                            const ratingEl = document.getElementById(
                              `rating-${item.product_id}`
                            ) as HTMLInputElement;
                            const commentEl = document.getElementById(
                              `comment-${item.product_id}`
                            ) as HTMLInputElement;
                            submitReview(
                              item.product_id,
                              Number(ratingEl.value),
                              commentEl.value
                            );
                            ratingEl.value = "";
                            commentEl.value = "";
                          }}
                          className="bg-blue-500 text-white px-2 rounded"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
