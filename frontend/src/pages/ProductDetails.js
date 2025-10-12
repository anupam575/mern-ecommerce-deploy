import React, { useEffect, useState, useRef } from "react";
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
  const [mainImage, setMainImage] = useState("");

  // Zoom related state
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef();

  // ✅ Fetch product details
  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/api/v1/product/${id}`);
      dispatch(setProduct(data.product));
      setMainImage(data.product.images[0]?.url || "#");
    } catch (error) {
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
      img: mainImage || "#",
      cartId: uuidv4(),
    };
    dispatch(addToCart(cartItem));
    toast.success("🛒 Product added to cart!");
  };

  // Zoom handlers
  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setZoomPos({ x, y });
  };
  const handleMouseEnter = () => setShowZoom(true);
  const handleMouseLeave = () => setShowZoom(false);

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
        {/* Left side: Main Image + Thumbnails */}
        <div className="amazon-product-left">
          <img
            src={mainImage}
            alt={product.name}
            className="amazon-product-image"
            ref={imageRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />

          {/* Zoomed Image */}
          {showZoom && (
            <div
              className="zoom-result"
              style={{
                backgroundImage: `url(${mainImage})`,
                backgroundPosition: `${(zoomPos.x / imageRef.current.offsetWidth) * 100}% ${(zoomPos.y / imageRef.current.offsetHeight) * 100}%`,
                backgroundSize: `${imageRef.current.offsetWidth * 2}px ${imageRef.current.offsetHeight * 2}px`,
              }}
            />
          )}

          {/* Thumbnails */}
          <div className="amazon-product-thumbnails">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url || "#"}
                alt={`${product.name} ${idx + 1}`}
                className={`thumbnail-image ${
                  mainImage === img.url ? "selected" : ""
                }`}
                onClick={() => setMainImage(img.url)}
              />
            ))}
          </div>
        </div>

        {/* Right side: Product Info */}
        <div className="amazon-product-right">
          <h2 className="amazon-product-title">{product.name}</h2>
          <p className="amazon-product-description">{product.description}</p>
          <p className="amazon-product-rating">
            ⭐ {product.ratings.toFixed(1)} ({product.numOfReviews} reviews)
          </p>
          <p className="amazon-product-price">₹{product.price}</p>
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

