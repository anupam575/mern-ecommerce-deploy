import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./AllOrdersPage.css"; // optional styling
import OrderStatusUpdater from "./OrderStatusUpdater"; // ✅ import added

const AllOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.user?.token); // 🔑 token from redux

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(data.orders);
      setTotalAmount(data.totalAmount);
      setLoading(false);
    } catch (error) {
      console.error("❌ Failed to fetch orders:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(
        `http://localhost:4000/api/v1/admin/order/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders(); // refresh after delete
    } catch (error) {
      console.error("❌ Failed to delete order:", error);
      alert("Failed to delete the order.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="admin-orders-container">
      <h2>📦 All Orders (Admin)</h2>
      <p>Total Revenue: ₹{totalAmount}</p>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Email</th>
            <th>Total Price</th>
            <th>Status</th> {/* ✅ new column */}
            <th>Details</th>
            <th>Delete</th> {/* ✅ new column */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user?.name || "N/A"}</td>
              <td>{order.user?.email || "N/A"}</td>
              <td>₹{order.totalPrice}</td>
              <td>
                <OrderStatusUpdater
                  orderId={order._id}
                  currentStatus={order.orderStatus}
                  onStatusUpdated={fetchOrders}
                />
              </td>
              <td>
                <Link to={`/order/${order._id}`}>
                  <button className="view-btn">View</button>
                </Link>
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(order._id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllOrdersPage;
