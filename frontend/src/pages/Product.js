import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce"; // 🔹 npm i use-debounce
import API from "../utils/axiosInstance";
import "./style/Product.css";

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const keyword = useSelector((state) => state.search.keyword);
  const [debouncedKeyword] = useDebounce(keyword, 300); // 🔹 delay API call
  const navigate = useNavigate();

  // ✅ Reset page to 1 whenever keyword changes
  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword]);

  // ✅ Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await API.get(
        `/api/v1/products?keyword=${debouncedKeyword}&page=${page}`
      );

      setProducts(data.products || []);
      const total = data.filteredProductsCount || 0;
      const perPage = data.resultPerPage || 1;
      setTotalPages(Math.ceil(total / perPage));
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      const serverMessage =
        err.response?.data?.message || "Failed to load products";
      setError(serverMessage);
      toast.error(`❌ ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ✅ Pagination handler
  const handlePageClick = (pageNumber) => {
    if (pageNumber !== page) setPage(pageNumber);
  };

  // ✅ UI States
  if (loading)
    return <p style={{ textAlign: "center" }}>⏳ Loading products...</p>;

  if (error)
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  if (!products.length)
    return (
      <p style={{ textAlign: "center" }}>
        😕 No products found for "{debouncedKeyword || "all"}"
      </p>
    );

  return (
    <div className="product-container">
      <h1 className="title">🛍 All Products</h1>

      <div className="product-grid">
        {products.map((product) => (
          <div
            key={product._id}
            className="product-card"
            onClick={() =>
              navigate(`/product/${encodeURIComponent(product._id)}`)
            }
            style={{ cursor: "pointer" }}
            aria-label={`View details for ${product.name}`}
          >
            <img
              src={product.images[0]?.url || "/placeholder.png"}
              alt={product.name}
              className="product-image"
              loading="lazy"
            />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">₹{product.price}</p>
            <p className="product-rating">
              ⭐ {product.ratings} ({product.numOfReviews} reviews)
            </p>
          </div>
        ))}
      </div>

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="pagination-numbers">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => handlePageClick(page - 1)}
            aria-label="Go to previous page"
          >
            ◀ Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`page-btn ${page === num ? "active" : ""}`}
              onClick={() => handlePageClick(num)}
              aria-label={`Go to page ${num}`}
            >
              {num}
            </button>
          ))}

          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => handlePageClick(page + 1)}
            aria-label="Go to next page"
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default Product;
