import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Category = {
  category_id: number;
  category_name: string;
};

type Product = {
  product_id: number;
  product_name: string;
  price: number;
  stock: number;
  image_url: string;
  category_id: number;
  category_name: string;
};

const AdminHome = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          axios.get("http://localhost:3000/products", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/category", {
            withCredentials: true,
          }),
        ]);
        setProducts(productRes.data);
        setCategories(categoryRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products
    .filter((p) => p.product_name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) =>
      selectedCategory === "all"
        ? true
        : p.category_id.toString() === selectedCategory
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        🛍️ Product Management
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 justify-between mb-8">
        <input
          type="text"
          placeholder="Search product..."
          className="border p-2 rounded-lg w-full sm:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded-lg"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id.toString()}>
              {cat.category_name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded-lg"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc" | "")}
        >
          <option value="">Sort by</option>
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>

        <Link
          to="/admin/addProduct"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Product
        </Link>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.product_id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <img
                src={
                  product.image_url
                    ? `http://localhost:3000${product.image_url}`
                    : "https://via.placeholder.com/150"
                }
                alt={product.product_name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h2 className="text-lg font-semibold">{product.product_name}</h2>
              <p className="text-gray-500 text-sm mb-1">
                {product.category_name}
              </p>
              <p className="text-blue-600 font-bold text-lg mb-2">
                ฿{product.price}
              </p>
              <p className="text-sm text-gray-600">Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminHome;
