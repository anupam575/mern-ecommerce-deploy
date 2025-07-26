import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './OrderDetailPage.css'; // optional css

const OrderDetailPage = () => {
  const { id } = useParams(); // URL se order ID
  const token = useSelector((state) => state.auth.user?.token);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/order/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API Response:", res.data.order);
        console.log("✅ Order Created:", res.data.order);
        console.log("🛒 Items:", res.data.order.orderItems);

        setOrder(res.data.order);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  if (loading) return <p>Loading order...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="order-detail-container">
      <h2>Order Details</h2>

      <section className="section">
        <h3>Shipping Info</h3>
        <p><strong>Address:</strong> {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state}, {order.shippingInfo.country} - {order.shippingInfo.pinCode}</p>
        <p><strong>Phone:</strong> {order.shippingInfo.phoneNo}</p>
      </section>

      <section className="section">
        <h3>User Info</h3>
        <p><strong>Name:</strong> {order.user.name}</p>
        <p><strong>Email:</strong> {order.user.email}</p>
      </section>

      <section className="section">
        <h3>Order Items</h3>
        <ul>
          {order.orderItems.map((item) => (
            <li key={item.product}>
              {item.name} - ₹{item.price} × {item.quantity}
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h3>Payment Info</h3>
        <p><strong>Status:</strong> {order.paymentInfo.status}</p>
        <p><strong>Paid At:</strong> {new Date(order.paidAt).toLocaleString()}</p>
      </section>

      <section className="section">
        <h3>Price Summary</h3>
        <p><strong>Items:</strong> ₹{order.itemsPrice}</p>
        <p><strong>Tax:</strong> ₹{order.taxPrice}</p>
        <p><strong>Shipping:</strong> ₹{order.shippingPrice}</p>
        <p><strong>Total:</strong> ₹{order.totalPrice}</p>
      </section>

      {/* ✅ Added: Order Status Section (for user visibility) */}
      <section className="section">
        <h3>Order Status</h3>
        <p><strong>Status:</strong> {order.orderStatus}</p>
        {order.orderStatus === "Delivered" && order.deliveredAt && (
          <p><strong>Delivered At:</strong> {new Date(order.deliveredAt).toLocaleString()}</p>
        )}
      </section>
    </div>
  );
};

export default OrderDetailPage;
