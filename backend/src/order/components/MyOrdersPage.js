import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
  const token = useSelector((state) => state.auth.user?.token);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/orders/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📦 All orders fetched:", res.data.orders);

      // ✅ OLD (commented but kept for ref)
      // const unique = Array.from(new Map(res.data.orders.map(o => [o._id, o])).values());

      // ✅ NEW — Better duplicate filter
      const seen = new Set();
      const unique = res.data.orders.filter(order => {
        if (seen.has(order._id)) return false;
        seen.add(order._id);
        return true;
      });

      console.log("✅ Unique orders:", unique);
      setOrders(unique);
    } catch (err) {
      console.error('Failed to fetch orders:', err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading your orders...</p>;

  return (
    <div className="my-orders-container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>₹{order.totalPrice}</td>
                <td>{order.paymentInfo?.status}</td>
                <td>
                  <Link to={`/order/${order._id}`} className="view-btn">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrdersPage;
