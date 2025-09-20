import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import API from "../../utils/axiosInstance"; // centralized axios instance

const ProductDeletePanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState("");
  const modalRef = useRef(null);

  // Fetch products from server
  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/api/v1/admin/products");
      setProducts(data.products);
      setError("");
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to load products");
      toast.error("⚠️ Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Confirm and delete product
  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      setDeletingId(confirmDeleteId);
      await API.delete(`/api/v1/admin/product/${confirmDeleteId}`);
      setProducts((prev) => prev.filter((p) => p._id !== confirmDeleteId));
      toast.success("✅ Product deleted successfully");
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("❌ Failed to delete product:", err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  // ESC key close & focus trap for modal
  useEffect(() => {
    if (!confirmDeleteId) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setConfirmDeleteId(null);
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmDeleteId]);

  return (
    <div className="delete-panel">
      <h2>🗑️ Delete Products</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
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
                <td>{p.stock}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => setConfirmDeleteId(p._id)}
                    disabled={deletingId === p._id}
                    aria-label={`Delete product ${p.name}`}
                  >
                    {deletingId === p._id ? "Deleting..." : "❌ Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Custom Confirmation Modal */}
      {confirmDeleteId && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="modal" ref={modalRef}>
            <h3 id="delete-modal-title">⚠️ Confirm Delete</h3>
            <p>Are you sure you want to delete this product?</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setConfirmDeleteId(null)}
                autoFocus
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDeletePanel;
