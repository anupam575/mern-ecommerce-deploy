import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import API from "../utils/axiosInstance";
import { addCartItem } from "../redux/slices/cartSlice";
import { setProduct, clearProduct } from "../redux/slices/productSlice";
import ReviewSection from "./ReviewSection";
import ImageZoom from "./ImageZoom";

import "./style/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.producting.product);

  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [error, setError] = useState(null);

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

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await dispatch(addCartItem({ productId: product._id, quantity: 1 })).unwrap();
      toast.success("🛒 Product added to cart!");
    } catch (err) {
      toast.error(err.message || "❌ Failed to add product to cart");
    }
  };

  if (loading) return <div className="loading-placeholder">Loading...</div>;
  if (error) return <p className="error-message">{error}</p>;
  if (!product) return <p>❌ Product not found.</p>;

  return (
    <>
      <div className="amazon-product-container">
        <div className="amazon-product-left">
          {/* Desktop Hover Zoom */}
          {mainImage && <ImageZoom src={mainImage} />}

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

