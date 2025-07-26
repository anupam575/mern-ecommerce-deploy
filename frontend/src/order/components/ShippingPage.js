import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import './ShippingPage.css';
import { useNavigate } from 'react-router-dom';
import { saveShippingInfo } from '../../redux/slices/shippingSlice';
import { toast, ToastContainer } from 'react-toastify'; // ✅ Toastify
import 'react-toastify/dist/ReactToastify.css'; // ✅ Toastify CSS

const ShippingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Save shippingInfo to Redux
    dispatch(saveShippingInfo(shippingInfo));

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const orderItems = cartItems.map((item) => ({
      name: item.title,
      quantity: item.quantity,
      image: item.img,
      price: item.price,
      product: item.id,
    }));

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

    // ❌ Block actual order creation at this point
    // ✅ Order will now only be created after Stripe payment is successful (in PaymentPage)

    /*
    try {
      const res = await axios.post('http://localhost:4000/api/v1/order/new', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Order Created:', res.data);
      toast.success("✅ Order placed successfully!");
      navigate("/payment");
    } catch (error) {
      console.error('❌ Order Error:', error.response?.data || error.message);
      toast.error("❌ Failed to place order.");
    }
    */

    // ✅ Just go to payment page (real order will happen from there)
    navigate("/payment");
  };

  return (
    <div className="shipping-container">
      <ToastContainer /> {/* ✅ Toast Container */}

      <div className="shipping-left">
        <h2>Cart Summary</h2>
        {cartItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
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
          <button type="submit" className="submit-btn">Proceed to Payment</button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
