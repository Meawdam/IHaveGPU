// src/pages/admin/AddProduct.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

type Category = {
  category_id: number;
  category_name: string;
};

const AddProduct = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState({
    product_name: "",
    price: "",
    stock: "",
    category_id: "",
    brand: "",
    description: "",
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    axios.get("http://localhost:3000/category", { withCredentials: true })
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      Swal.fire({ icon: "warning", title: "Please select an image" });
      return;
    }

    const formData = new FormData();
    formData.append("product_name", product.product_name);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("category_id", product.category_id);
    formData.append("brand", product.brand);
    formData.append("description", product.description);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:3000/products", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({ icon: "success", title: "Product added!", timer: 1500, showConfirmButton: false });

      setProduct({ product_name: "", price: "", stock: "", category_id: "", brand: "", description: "" });
      setImage(null);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Failed to add product", timer: 1500, showConfirmButton: false });
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-semibold mb-6 text-center">➕ Add New Product</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow space-y-4">
        <div>
          <label className="text-gray-600">Product Name</label>
          <input
            type="text"
            name="product_name"
            value={product.product_name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-gray-600">Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>
          <div className="flex-1">
            <label className="text-gray-600">Stock</label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-gray-600">Category</label>
          <select
            name="category_id"
            value={product.category_id}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map(cat => (
              <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-600">Brand</label>
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        <div>
          <label className="text-gray-600">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
            rows={4}
          />
        </div>

        <div>
          <label className="text-gray-600">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 cursor-pointer"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
