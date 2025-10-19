import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// React Icons imports
import { FaStar, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaShoppingCart } from "react-icons/fa";

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
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Fetch product details from backend
  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/api/v1/product/${id}`);
      const productData = data.dog;

      // Fallback main image
      const firstImage = productData.images?.[0]?.url || "/placeholder.png";
      setMainImage(firstImage);

      dispatch(setProduct(productData));
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load product details";
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

  // Add to cart handler
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

  const ratingValue =
    product.ratings !== null && product.ratings !== undefined
      ? Number(product.ratings).toFixed(1)
      : 0;

  return (
    <>
      <div className="amazon-product-container">
        {/* Left side: main image + thumbnails */}
        <div className="amazon-product-left">
          {mainImage && <ImageZoom src={mainImage} />}

          <div className="amazon-product-thumbnails">
            {product.images?.length > 0 ? (
              product.images.map((img, idx) => (
                <img
                  key={img._id || idx}
                  src={img.url || "/placeholder.png"}
                  alt={img.label ? `${product.name} - ${img.label}` : product.name}
                  className={`thumbnail-image ${mainImage === img.url ? "selected" : ""}`}
                  onClick={() => img.url && setMainImage(img.url)}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              ))
            ) : (
              <img src="/placeholder.png" alt="No image available" />
            )}
          </div>
        </div>

        {/* Right side: product info */}
        <div className="amazon-product-right">
          <h2>{product.name || "No Name"}</h2>
          <p>{product.description || "No Description Available"}</p>
          <p>
            <FaStar className="icon star" /> {ratingValue} ({product.numOfReviews || 0} reviews)
          </p>
          <p>₹{product.price !== undefined ? product.price : "0"}</p>
          <p>Category: {product.category?.name || "Uncategorized"}</p>

          {product.inStock ? (
            product.lowStock ? (
              <p className="low-stock">
                <FaExclamationTriangle className="icon warning" /> Only {product.stock} left in stock!
              </p>
            ) : (
              <p className="in-stock">
                <FaCheckCircle className="icon check" /> In Stock
              </p>
            )
          ) : (
            <p className="out-of-stock">
              <FaTimesCircle className="icon cross" /> Out of Stock
            </p>
          )}

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <FaShoppingCart className="icon cart" /> {product.inStock ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>

      {/* Reviews section */}
      <ReviewSection />
    </>
  );
}

export default ProductDetails;


