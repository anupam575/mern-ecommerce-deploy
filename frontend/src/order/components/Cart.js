// src/features/Cart.js
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  // 🔹 Total price calculation (memoized for performance)
  const totalPrice = useMemo(() => {
    return cartItems
      .reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0)
      .toFixed(2);
  }, [cartItems]);

  const handleBuyNow = () => {
    if (cartItems.length === 0) return;
    navigate("/shipping");
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

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
            {cartItems.map((item) => (
              <div key={item.cartId} className="cart-item">
                <img
                  src={item.images?.[0]?.url || item.img || "/placeholder.png"}
                  alt={item.title || item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.title || item.name}</h3>
                  <p className="cart-item-price">₹{Number(item.price).toFixed(2)}</p>

                  <div className="quantity-control" aria-label="Quantity control">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => dispatch(decreaseQuantity(item.cartId))}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => dispatch(increaseQuantity(item.cartId))}
                    >
                      +
                    </button>
                  </div>

                  <p className="cart-item-total">
                    Total: ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </p>

                  <button
                    className="remove-btn"
                    aria-label={`Remove ${item.title || item.name} from cart`}
                    onClick={() => dispatch(removeFromCart(item.cartId))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <h3>Total Price: ₹{totalPrice}</h3>
            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
              aria-label="Proceed to shipping"
            >
              Proceed to Shipping
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
