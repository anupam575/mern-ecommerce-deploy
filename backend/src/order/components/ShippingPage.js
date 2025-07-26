import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ShippingPage.css';

const ShippingPage = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const token = useSelector((state) => state.auth.user?.token);

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    phoneNo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ prevent double submission

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true); // ✅ lock submit

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const orderMap = {};
    cartItems.forEach((item) => {
      const productId = item.product;
      if (orderMap[productId]) {
        orderMap[productId].quantity += item.quantity;
      } else {
        orderMap[productId] = {
          name: item.title,
          quantity: item.quantity,
          image: item.img,
          price: item.price,
          product: productId,
        };
      }
    });

    const orderItems = Object.values(orderMap);
    const paymentInfo = {
      id: 'dummy_payment_id_12345',
      status: 'succeeded',
    };

    const orderData = {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    };

    try {
      const res = await axios.post('http://localhost:4000/api/v1/order/new', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log('✅ Order Created:', res.data);
      alert('Order Placed Successfully!');
      navigate(`/order/${res.data.order._id}`);
    } catch (error) {
      console.error('❌ Order Error:', error.response?.data || error.message);
      alert('Failed to place order.');
    } finally {
      setIsSubmitting(false); // ✅ unlock
    }
  };

  return (
    <div className="shipping-container">
      <div className="shipping-left">
        <h2>Cart Summary</h2>
        {cartItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.cartId}>
                <div className="summary-item">
                  <img src={item.img} alt={item.title} />
                  <div>
                    <p>{item.title}</p>
                    <p>₹{item.price} × {item.quantity}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <h3>
          Total: ₹
          {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
        </h3>
      </div>

      <div className="shipping-right">
        <h2>Shipping Address</h2>
        <form onSubmit={handleSubmit} className="shipping-form">
          <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
          <input type="text" name="city" placeholder="City" onChange={handleChange} required />
          <input type="text" name="state" placeholder="State" onChange={handleChange} required />
          <input type="text" name="country" placeholder="Country" onChange={handleChange} required />
          <input type="text" name="pinCode" placeholder="Pin Code" onChange={handleChange} required />
          <input type="tel" name="phoneNo" placeholder="Phone Number" onChange={handleChange} required />
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Placing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
