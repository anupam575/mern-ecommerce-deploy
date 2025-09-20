import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import API from "../utils/axiosInstance";
import { addToCart } from "../redux/slices/cartSlice";
import { setProduct, clearProduct } from "../redux/slices/productSlice";
import ReviewSection from "./ReviewSection";

import "./style/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const product = useSelector((state) => state.product.product);
  const [loading, setLoading] = useState(true);

  // ✅ Product details fetch
  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/api/v1/product/${id}`);
      dispatch(setProduct(data.product));
    } catch (error) {
      console.error("❌ Product fetch error:", error);
      toast.error(
        error.response?.data?.message || "❌ Failed to load product details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProductDetails();
    return () => dispatch(clearProduct());
  }, [id, dispatch]);

  // ✅ Add to cart
  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product._id,
      title: product.name,
      price: product.price,
      img: product.images[0]?.url || "#",
      cartId: uuidv4(),
    };

    dispatch(addToCart(cartItem));
    toast.success("🛒 Product added to cart!");
  };

  // ✅ Loading UI
  if (loading)
    return (
      <div className="loading-placeholder">
        <p>Loading product details...</p>
      </div>
    );

  if (!product) return <p>❌ Product not found.</p>;

  return (
    <>
      <div className="amazon-product-container">
        {/* Product Images */}
        <div className="amazon-product-left">
          <img
            src={product.images[0]?.url || "#"}
            alt={product.name}
            className="amazon-product-image"
          />
        </div>

        {/* Product Info */}
        <div className="amazon-product-right">
          <h2 className="amazon-product-title">{product.name}</h2>
          <p className="amazon-product-description">{product.description}</p>
          <p className="amazon-product-rating">
            ⭐ {product.ratings.toFixed(1)} ({product.numOfReviews} reviews)
          </p>
          <p className="amazon-product-price">₹{product.price}</p>

          {/* ✅ Category */}
          <p className="amazon-product-category">
            📦 Category: {product.category?.name || "Uncategorized"}
          </p>

          {/* ✅ Stock status */}
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

          {/* ✅ Actions */}
          <div className="amazon-product-actions">
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              aria-label="Add product to cart"
              disabled={!product.inStock} // 🚫 disable if not in stock
            >
              {product.inStock ? "Add to Cart" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Review Section */}
      <ReviewSection />
    </>
  );
}

export default ProductDetails;
