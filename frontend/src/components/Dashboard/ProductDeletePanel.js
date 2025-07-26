import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductDeletePanel.css"; // ⬅️ CSS import

const ProductDeletePanel = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/admin/products", {
          withCredentials: true,
        });
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };

    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    const confirmDelete = window.confirm("Are you sure to delete?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:4000/api/v1/admin/product/${id}`, {
        withCredentials: true,
      });
      alert("✅ Product deleted");
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  return (
    <div className="delete-panel">
      <h2>🗑 Delete Products</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price (₹)</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.Stock}</td>
              <td>
                <button className="delete-btn" onClick={() => deleteHandler(p._id)}>
                  ❌ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductDeletePanel;
