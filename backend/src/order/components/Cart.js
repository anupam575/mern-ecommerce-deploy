// src/features/Cart.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from '../../redux/slices/cartSlice';
import "./Cart.css";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleBuyNow = () => {
    navigate('/shipping');
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.cartId} className="cart-item">
              <img
                src={item.images?.[0]?.url || item.img || "#"}
                alt={item.title || item.name}
                className="cart-item-img"
              />
              <div className="cart-item-details">
                <h3>{item.title || item.name}</h3>
                <p>₹{item.price}</p>

                <div className="quantity-control">
                  <button onClick={() => dispatch(decreaseQuantity(item.cartId))}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => dispatch(increaseQuantity(item.cartId))}>
                    +
                  </button>
                </div>

                <p>Total: ₹{item.price * item.quantity}</p>

                <button
                  className="remove-btn"
                  onClick={() => dispatch(removeFromCart(item.cartId))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="cart-total">
          <h3>Total Price: ₹{totalPrice}</h3>
          <button className="buy-now-btn" onClick={handleBuyNow}>
            Proceed to Shipping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
