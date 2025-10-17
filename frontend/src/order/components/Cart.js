
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
} from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: cartItems, status, error } = useSelector((state) => state.cart);

  // 🔹 Fetch cart on mount
  useEffect(() => {
    dispatch(fetchCart())
      .unwrap()
      .then((res) => console.log("✅ fetchCart fulfilled:", res))
      .catch((err) => console.error("❌ fetchCart failed:", err));
  }, [dispatch]);

  // 🔹 Log cart updates
  useEffect(() => console.log("🧾 Cart items updated:", cartItems), [cartItems]);

  // 🔹 Show status & error
  useEffect(() => {
    console.log("📦 Cart status:", status);
    if (error) console.error("⚠️ Cart error:", error);
  }, [status, error]);

  // 🔹 Total price calculation (safe)
  const totalPrice = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems
      .reduce(
        (total, item) =>
          total + (Number(item?.product?.price) || 0) * (Number(item?.quantity) || 0),
        0
      )
      .toFixed(2);
  }, [cartItems]);

  // 🔹 Handle Buy Now
  const handleBuyNow = () => {
    if (cartItems.length === 0) return;
    navigate("/shipping");
  };

  // 🔹 Handle Increase Quantity
  const handleIncrease = (id, quantity) => {
    dispatch(updateCartItem({ cartItemId: id, quantity: quantity + 1 }));
  };

  // 🔹 Handle Decrease Quantity with automatic removal if 0
  const handleDecrease = (id, quantity) => {
    const newQuantity = quantity - 1;
    if (newQuantity <= 0) {
      dispatch(removeCartItem(id)); // quantity 0 → remove item
    } else {
      dispatch(updateCartItem({ cartItemId: id, quantity: newQuantity }));
    }
  };

  // 🔹 Handle Remove Item
  const handleRemove = (id) => {
    dispatch(removeCartItem(id));
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {status === "loading" && <p>⏳ Loading your cart...</p>}
      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p className="empty-cart-text">Your cart is empty!</p>
          <button className="continue-shopping-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => {
              const product = item.product || {};
              const imageUrl = product.images?.[0]?.url || "/placeholder.png";
              const productName = product.name || "Unknown Product";
              const productPrice = Number(product.price) || 0;
              const quantity = Number(item.quantity) || 0;

              return (
                <div key={item._id} className="cart-item">
                  <img src={imageUrl} alt={productName} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h3 className="cart-item-title">{productName}</h3>
                    <p className="cart-item-price">₹{productPrice.toFixed(2)}</p>

                    <div className="quantity-control">
                      <button
                        onClick={() => handleDecrease(item._id, quantity)}
                        disabled={quantity <= 0}
                      >
                        -
                      </button>
                      <span>{quantity}</span>
                      <button onClick={() => handleIncrease(item._id, quantity)}>+</button>
                    </div>

                    <p className="cart-item-total">
                      Total: ₹{(productPrice * quantity).toFixed(2)}
                    </p>

                    <button className="remove-btn" onClick={() => handleRemove(item._id)}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-total">
            <h3>Total Price: ₹{totalPrice}</h3>
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Proceed to Shipping
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
