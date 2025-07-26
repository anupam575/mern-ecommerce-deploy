import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./style/Product.css";

const API = "http://localhost:4000/api/v1";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const keyword = useSelector((state) => state.search.keyword);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/products?keyword=${keyword}&page=${page}`);
      setProducts(data.products);
      const total = data.filteredProductsCount;
      const perPage = data.resultPerPage;
      setTotalPages(Math.ceil(total / perPage));
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProducts();
  }, [keyword, page]);

  const handlePageClick = (pageNumber) => {
    if (pageNumber !== page) {
      setPage(pageNumber);
    }
  };

  return (
    <div className="product-container">
      <h1 className="title">🛍 All Products</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <div
                key={product._id}
                className="product-card"
                onClick={() => navigate(`/product/${product._id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={product.images[0]?.url || "#"}
                  alt={product.name}
                  className="product-image"
                />
                <h2 className="product-name">{product.name}</h2>
                <p className="product-price">₹{product.price}</p>
                <p className="product-rating">
                  ⭐ {product.ratings} ({product.numOfReviews} reviews)
                </p>
              </div>
            ))}
          </div>

          {/* Numbered Pagination */}
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`page-btn ${page === num ? "active" : ""}`}
                onClick={() => handlePageClick(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
