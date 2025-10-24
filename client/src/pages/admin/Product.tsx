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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const resProduct = await axios.get(
          `http://localhost:3000/products/${id}`
        );
        setProduct(resProduct.data);
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

  if (!product) return <div className="text-center mt-10">Loading...</div>;
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
            to="/admin/home"
            className="block text-center w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition mb-6"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
