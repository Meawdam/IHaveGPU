import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

type Product = {
  product_id: number;
  product_name: string;
  price: number;
  stock: number;
  image_url: string;
  category_name: string;
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get("http://localhost:3000/products", { withCredentials: true });
        const shuffled = res.data.sort(() => Math.random() - 0.5);
        setFeaturedProducts(shuffled.slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to IHaveGpu</h1>
          <p className="text-lg">Find the best GPU for your setup!</p>
          <Link
            to="/shop"
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">🔥 Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link
              to={`/shop/product/${product.product_id}`}
              key={product.product_id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <img
                src={product.image_url ? `http://localhost:3000${product.image_url}` : "https://via.placeholder.com/150"}
                alt={product.product_name}
                className="w-full h-full object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold">{product.product_name}</h3>
              <p className="text-gray-500 text-sm">{product.category_name}</p>
              <p className="text-blue-600 font-bold text-lg mt-2">฿{product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
