import { useEffect, useState } from "react";
import axios from "axios";

type Review = {
  review_id: number;
  username: string;
  product_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

const ManageReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async () => {
    const res = await axios.get("http://localhost:3000/admin/reviews", {
      withCredentials: true
    });
    setReviews(res.data);
  };

  const deleteReview = async (id: number) => {
    await axios.delete(`http://localhost:3000/admin/reviews/${id}`, {
      withCredentials: true
    });
    fetchReviews();
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Reviews</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr>
            <th>Username</th>
            <th>Product</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.review_id}>
              <td>{r.username}</td>
              <td>{r.product_name}</td>
              <td>{r.rating}</td>
              <td>{r.comment}</td>
              <td>{r.created_at}</td>
              <td>
                <button onClick={() => deleteReview(r.review_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageReviews;
