


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Star, ErrorOutline, CheckCircle, Cancel, ShoppingCart } from "@mui/icons-material";

import { addCartItem } from "../redux/slices/cartSlice";
import { fetchProduct, clearProduct } from "../redux/slices/productSlice";
import ReviewSection from "./ReviewSection";
import ImageZoom from "./ImageZoom";
import "./style/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // ✅ Get product state from Redux
  const { product, loading, error } = useSelector((state) => state.product);
  const { stats } = useSelector((state) => state.reviews);

  const average = Number(stats?.average || 0);
  const total = stats?.total || 0;

  const [mainImage, setMainImage] = useState("/placeholder.png");

  // Fetch product on mount
  useEffect(() => {
    if (id) dispatch(fetchProduct(id));
    return () => dispatch(clearProduct());
  }, [id, dispatch]);

  // Update main image when product loads
  useEffect(() => {
    if (product) setMainImage(product.mainImage || "/placeholder.png");
  }, [product]);

  // Show toast on error
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await dispatch(addCartItem({ productId: product._id, quantity: 1 })).unwrap();
      toast.success("Product added to cart!");
    } catch (err) {
      toast.error(err.message || "Failed to add product to cart");
    }
  };

  if (loading) return <div className="loading-placeholder">Loading...</div>;
  if (error) return <p className="error-message">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <>
      <div className="amazon-product-container">
        {/* Left: Main image + thumbnails */}
        <div className="amazon-product-left">
          {mainImage && <ImageZoom src={mainImage} />}
          <div className="amazon-product-thumbnails">
            {product.thumbnails?.map((url, idx) => (
              <img
                key={idx}
                src={url || "/placeholder.png"}
                alt={`${product.name} thumbnail ${idx + 1}`}
                className={`thumbnail-image ${mainImage === url ? "selected" : ""}`}
                onClick={() => setMainImage(url)}
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            ))}
          </div>
        </div>

        {/* Right: Product info */}
        <div className="amazon-product-right">
          <h2>{product.name || "No Name"}</h2>
          <p>{product.description || "No Description Available"}</p>

          <p>
            <Star className="icon star" /> {average.toFixed(1)} ({total} reviews)
          </p>

          <p>₹{product.price ?? 0}</p>
          <p>Category: {product.category?.name || "Uncategorized"}</p>

          {product.inStock ? (
            product.lowStock ? (
              <p className="low-stock">
                <ErrorOutline className="icon warning" /> Only {product.stock} left in stock!
              </p>
            ) : (
              <p className="in-stock">
                <CheckCircle className="icon check" /> In Stock
              </p>
            )
          ) : (
            <p className="out-of-stock">
              <Cancel className="icon cross" /> Out of Stock
            </p>
          )}

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="icon cart" /> {product.inStock ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>

      {/* Review Section */}
      <ReviewSection />
    </>
  );
}

export default ProductDetails;















