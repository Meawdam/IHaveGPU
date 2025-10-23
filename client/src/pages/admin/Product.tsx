import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  created_at: string;
};

const AdminProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, reviewRes] = await Promise.all([
          axios.get(`http://localhost:3000/products/${id}`),
          axios.get(`http://localhost:3000/reviews?product_id=${id}`),
        ]);
        setProduct(productRes.data);
        setReviews(reviewRes.data);
      } catch (err: any) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to fetch data",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );

  if (!product)
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Product not found
      </div>
    );

  // แปลง \r, \n, \t เป็นตัวจริง
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
            className="w-full object-contain"
          />
        </div>

        <div className="p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {product.product_name}
          </h1>
          <p className="text-gray-500 mb-2">{product.brand}</p>
          <p className="text-yellow-600 font-bold text-lg md:text-xl mb-2">
            ฿{product.price.toLocaleString()}
          </p>
          <p
            className={`mb-4 font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.stock > 0
              ? `In stock: ${product.stock}`
              : "Out of stock"}
          </p>

          <p className="text-gray-700 mb-6 whitespace-pre-wrap break-words">
            {formatText(product.description)}
          </p>

          <div>
            <h2 className="text-xl font-semibold mb-2">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <ul className="space-y-3 max-h-96 overflow-y-auto">
                {reviews.map((r) => (
                  <li
                    key={r.review_id}
                    className="border p-3 rounded shadow-sm bg-gray-50"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">{r.username}</span>
                      <span className="text-yellow-600">{r.rating}⭐</span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap break-words">
                      {formatText(r.comment)}
                    </p>
                    <span className="text-gray-400 text-sm">
                      {new Date(r.created_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetailPage;
