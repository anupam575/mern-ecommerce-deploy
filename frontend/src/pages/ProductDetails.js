import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import API from "../utils/axiosInstance";
import { addCartItem } from "../redux/slices/cartSlice";
import { setProduct, clearProduct } from "../redux/slices/productSlice";
import ReviewSection from "./ReviewSection";

import "./style/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.product);

  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [error, setError] = useState(null);

  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef();

  // ✅ Fetch product details
  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/api/v1/product/${id}`);
      dispatch(setProduct(data.dog));
      setMainImage(data.dog.images?.[0]?.url || null);
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Failed to load product details";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProductDetails();
    return () => dispatch(clearProduct());
  }, [id, dispatch]);

  // ✅ Add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await dispatch(addCartItem({ productId: product._id, quantity: 1 })).unwrap();
      toast.success("🛒 Product added to cart!");
    } catch (err) {
      toast.error(err.message || "❌ Failed to add product to cart");
    }
  };

  // ✅ Zoom handlers
  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setZoomPos({ x, y });
  };
  const handleMouseEnter = () => setShowZoom(true);
  const handleMouseLeave = () => setShowZoom(false);

  // ✅ Loading / error UI
  if (loading) {
    return (
      <div className="loading-placeholder">
        <div className="img-skeleton" />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) return <p className="error-message">{error}</p>;
  if (!product) return <p>❌ Product not found.</p>;

  return (
    <>
      <div className="amazon-product-container">
        {/* Left Section (Images) */}
        <div className="amazon-product-left">
          {!loading && mainImage && (
            <img
              src={mainImage || "/placeholder.png"}
              alt={product.name}
              className="amazon-product-image"
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onError={(e) => (e.target.src = "/placeholder.png")}
            />
          )}

          {showZoom && mainImage && (
            <div
              className="zoom-result"
              style={{
                backgroundImage: `url(${mainImage})`,
                backgroundPosition: `${(zoomPos.x / imageRef.current.offsetWidth) * 100}% ${(zoomPos.y / imageRef.current.offsetHeight) * 100}%`,
                backgroundSize: `${imageRef.current.offsetWidth * 2}px ${imageRef.current.offsetHeight * 2}px`,
              }}
            />
          )}

          <div className="amazon-product-thumbnails">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img.url || "/placeholder.png"}
                alt={`${product.name} ${idx + 1}`}
                className={`thumbnail-image ${mainImage === img.url ? "selected" : ""}`}
                onClick={() => img.url && setMainImage(img.url)}
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            ))}
          </div>
        </div>

        {/* Right Section (Details) */}
        <div className="amazon-product-right">
          <h2 className="amazon-product-title">{product.name}</h2>
          <p className="amazon-product-description">{product.description}</p>
          <p className="amazon-product-rating">
            ⭐ {product.ratings?.toFixed(1) || 0} ({product.numOfReviews || 0} reviews)
          </p>
          <p className="amazon-product-price">₹{product.price || "-"}</p>
          <p className="amazon-product-category">
            📦 Category: {product.category?.name || "Uncategorized"}
          </p>

          {product.inStock ? (
            product.lowStock ? (
              <p className="amazon-product-stock low-stock">
                ⚠️ Only {product.stock} left in stock — order soon!
              </p>
            ) : (
              <p className="amazon-product-stock in-stock">✅ In Stock</p>
            )
          ) : (
            <p className="amazon-product-stock out-of-stock">❌ Out of Stock</p>
          )}

          <div className="amazon-product-actions">
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              aria-label="Add product to cart"
              disabled={!product.inStock}
            >
              {product.inStock ? "Add to Cart" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>

      <ReviewSection />
    </>
  );
}

export default ProductDetails;
