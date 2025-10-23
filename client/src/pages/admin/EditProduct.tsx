import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

type Category = {
  category_id: number;
  category_name: string;
};

type Product = {
  product_id: number;
  product_name: string;
  price: number;
  stock: number;
  category_id: number;
  image_url: string;
  description?: string;
};

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product>({
    product_id: 0,
    product_name: "",
    price: 0,
    stock: 0,
    category_id: 0,
    image_url: "",
    description: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          axios.get(`http://localhost:3000/products/${id}`, { withCredentials: true }),
          axios.get("http://localhost:3000/category", { withCredentials: true }),
        ]);
        setProduct(productRes.data);
        setCategories(categoryRes.data);
      } catch (err: any) {
        Swal.fire("Error", err.response?.data?.message || "Fetch failed", "error");
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("product_name", product.product_name);
      formData.append("price", product.price.toString());
      formData.append("stock", product.stock.toString());
      formData.append("category_id", product.category_id.toString());
      formData.append("description", product.description || ""); // <-- description
      if (imageFile) formData.append("image", imageFile);

      await axios.put(`http://localhost:3000/products/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success", "Product updated successfully", "success");
      navigate("/admin/home");
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <h1 className="text-3xl font-semibold mb-6 text-center">✏️ Edit Product</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            className="border p-2 rounded-lg w-full"
            value={product.product_name}
            onChange={(e) => setProduct({ ...product, product_name: e.target.value })}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            className="border p-2 rounded-lg w-full"
            rows={4}
            value={product.description || ""}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            required
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            className="border p-2 rounded-lg w-full"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
            required
          />
        </label>

        <label>
          Stock:
          <input
            type="number"
            className="border p-2 rounded-lg w-full"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
            required
          />
        </label>

        <label>
          Category:
          <select
            className="border p-2 rounded-lg w-full"
            value={product.category_id}
            onChange={(e) => setProduct({ ...product, category_id: Number(e.target.value) })}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Image:
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded-lg w-full"
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
          />
        </label>

        {product.image_url && (
          <img
            src={`http://localhost:3000${product.image_url}`}
            alt="preview"
            className="w-full h-full object-cover rounded-lg"
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
