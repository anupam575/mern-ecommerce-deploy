// ✅ ProductDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./style/ProductDetails.css"; // 🔥 CSS Import
import ReviewSection from "./ReviewSection"; // ⭐ New Import

// ✅ Redux + Toast
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice"; // ✅ adjust path if needed
import { toast } from "react-toastify";

// ✅ New Import for Unique Cart ID
import { v4 as uuidv4 } from "uuid"; // ✅

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch(); // ✅ Redux dispatch

  const fetchProductDetails = async () => {
    try {
      const { data } = await axios.get(`http://localhost:4000/api/v1/product/${id}`);
      setProduct(data.product);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  if (loading) return <p>Loading product details...</p>;
  if (!product) return <p>Product not found.</p>;

  const loggedInUser = JSON.parse(localStorage.getItem("user")); // 🔐 current user from localStorage

  // ✅ Handle Add to Cart (with unique cartId)
  const handleAddToCart = () => {
    const cartItem = {
      id: product._id,
      title: product.name,
      price: product.price,
      img: product.images[0]?.url || "#",
      cartId: uuidv4(), // ✅ Unique cart item ID
    };

    dispatch(addToCart(cartItem));
    toast.success("🛒 Product added to cart!");
  };

  return (
    <>
      <div className="amazon-product-container">
        <div className="amazon-product-left">
          <img
            src={product.images[0]?.url || "#"}
            alt={product.name}
            className="amazon-product-image"
          />
        </div>

        <div className="amazon-product-right">
          <h2 className="amazon-product-title">{product.name}</h2>
          <p className="amazon-product-description">{product.description}</p>
          <p className="amazon-product-rating">
            ⭐ {product.ratings} ({product.numOfReviews} reviews)
          </p>
          <p className="amazon-product-price">₹{product.price}</p>

          <p
            className={`amazon-product-stock ${
              product.Stock > 0 ? "in-stock" : "out-of-stock"
            }`}
          >
            {product.Stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <div className="amazon-product-actions">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="buy-now-btn">Buy Now</button>
          </div>
        </div>
      </div>

      {/* ⭐ Amazon-style Review Section with Instant Update */}
      <ReviewSection
        productId={product._id}
        user={loggedInUser}
        onReviewSubmit={fetchProductDetails} // ✅ Trigger update when review is submitted
      />
    </>
  );
}
