import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

type Product = {
  product_id: number;
  product_name: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category_name: string;
};

type Review = {
  review_id: number;
  username: string;
  rating: number;
  comment: string;
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const resProduct = await axios.get(
          `http://localhost:3000/products/${id}`
        );
        setProduct(resProduct.data);

        const resReviews = await axios.get(
          `http://localhost:3000/reviews?product_id=${id}`
        );
        setReviews(resReviews.data);
      } catch (err: any) {
        console.error(err);
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to fetch product",
          "error"
        );
      }
    };
    fetchProduct();
  }, [id]);

  const submitReview = async () => {
    if (!comment.trim())
      return Swal.fire("Error", "Comment cannot be empty", "error");
    try {
      const res = await axios.post(
        "http://localhost:3000/reviews",
        { product_id: Number(id), rating, comment },
        { withCredentials: true }
      );
      setReviews([res.data, ...reviews]);
      setComment("");
      setRating(5);
      Swal.fire({
        icon: "success",
        title: "Review added",
        showConfirmButton: false,
        timer: 1200,
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to add review", "error");
    }
  };

  if (!product) return <div className="text-center mt-10">Loading...</div>;

  // ฟังก์ชันแปลง \r, \n, \t เป็นตัวจริง
  const formatText = (text: string) =>
    text.replace(/\\r/g, "\r").replace(/\\n/g, "\n").replace(/\\t/g, "\t");

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white rounded-2xl shadow-md max-w-3xl w-full overflow-hidden">
        <div className="w-full">
          <img
            src={
              product.image_url
                ? `http://localhost:3000${product.image_url}`
                : "https://via.placeholder.com/150"
            }
            alt={product.product_name}
            className="w-full h-full object-cover rounded-t-2xl"
          />
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{product.product_name}</h1>
          <p className="text-gray-500 mb-2">{product.brand}</p>
          <p className="text-gray-700 mb-4 whitespace-pre-wrap break-words">
            {formatText(product.description)}
          </p>
          <p className="text-yellow-600 font-bold text-xl mb-2">
            ฿{product.price.toLocaleString()}
          </p>
          <p
            className={`mb-4 font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
          </p>

          <Link
            to="/shop"
            className="block text-center w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition mb-6"
          >
            Back to Shop
          </Link>

          <div>
            <h2 className="text-xl font-bold mb-2">Reviews</h2>
            {reviews.length === 0 && (
              <p className="text-gray-500 mb-4">No reviews yet.</p>
            )}
            {reviews.map((r) => (
              <div
                key={r.review_id}
                className="mb-2 p-2 border rounded-md whitespace-pre-wrap break-words"
              >
                <span className="font-semibold">{r.username}</span> ⭐{" "}
                {r.rating}
                <p>{formatText(r.comment)}</p>
              </div>
            ))}

            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Add your review</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-20 p-1 border rounded"
                />
                <input
                  type="text"
                  placeholder="Write your comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 p-1 border rounded"
                />
                <button
                  onClick={submitReview}
                  className="bg-yellow-400 text-white px-3 rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
