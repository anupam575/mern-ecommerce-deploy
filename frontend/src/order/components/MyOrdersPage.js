// ✅ MyOrdersPage.jsx (Responsive Amazon-style Cards + Table)
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/axiosInstance";
import "./MyOrdersPage.css";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user orders
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/api/v1/orders/me");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(
        "❌ Failed to fetch orders:",
        err.response?.data?.message || err.message
      );
      setError("Failed to fetch your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Memoized desktop rows (top-level, ESLint-safe)
  const desktopRows = useMemo(
    () =>
      orders.map((order) => (
        <tr key={order._id}>
          <td>{order._id}</td>
          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
          <td>{currencyFormatter.format(order.totalPrice)}</td>
          <td>{order.paymentInfo?.status || "N/A"}</td>
          <td>
            <Link
              to={`/order/${order._id}`}
              className="view-btn"
              aria-label={`View details for order ${order._id}`}
            >
              View
            </Link>
          </td>
        </tr>
      )),
    [orders]
  );

  // Memoized mobile cards
  const mobileCards = useMemo(
    () =>
      orders.map((order) => (
        <div key={order._id} className="order-card">
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Total:</strong> {currencyFormatter.format(order.totalPrice)}
          </p>
          <p>
            <strong>Payment Status:</strong> {order.paymentInfo?.status || "N/A"}
          </p>
          <Link
            to={`/order/${order._id}`}
            className="view-btn"
            aria-label={`View details for order ${order._id}`}
          >
            View Details
          </Link>
        </div>
      )),
    [orders]
  );

  // Early returns (safe, Hooks already called)
  if (loading)
    return <p style={{ textAlign: "center" }}>⏳ Loading your orders...</p>;
  if (error)
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        {error} <button onClick={fetchOrders}>Retry</button>
      </p>
    );
  if (orders.length === 0)
    return <p style={{ textAlign: "center" }}>No orders found.</p>;

  return (
    <div className="my-orders-container">
      <h2>My Orders</h2>

      {/* Desktop Table */}
      <div className="orders-table-wrapper desktop-only">
        <table className="orders-table" aria-label="List of My Orders">
          <caption className="sr-only">Your order history</caption>
          <thead>
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">Date</th>
              <th scope="col">Total</th>
              <th scope="col">Payment Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>{desktopRows}</tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards mobile-only">{mobileCards}</div>
    </div>
  );
}

export default MyOrdersPage;
