import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AllOrdersPage.css";
import OrderStatusUpdater from "./OrderStatusUpdater";
import API from "../../utils/axiosInstance";
import ConfirmModal from "../../pages/ConfirmModal";

function AllOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // Fetch Orders with Pagination
  const fetchOrders = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const { data } = await API.get(
        `/api/v1/admin/orders?page=${pageNumber}&limit=10`
      );
      setOrders(data.orders);
      setTotalAmount(data.totalAmount);
      setTotalPages(data.totalPages);
      setPage(data.currentPage);
      setError("");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        navigate("/login");
      } else {
        setError("Failed to fetch orders");
      }
    } finally {
      setLoading(false);
    }
  };

  // Optimistic Delete
  const confirmDelete = async () => {
    if (!deleteOrderId) return;
    const originalOrders = [...orders];
    setOrders((prev) => prev.filter((o) => o._id !== deleteOrderId));
    setDeleteOrderId(null);
    toast.info("🗑️ Deleting order...");

    try {
      await API.delete(`/api/v1/admin/order/${deleteOrderId}`);
      toast.success("✅ Order deleted successfully");
      fetchOrders(page);
    } catch (err) {
      console.error(err);
      setOrders(originalOrders);
      toast.error(err.response?.data?.message || "Failed to delete the order");
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, []);

  // Pagination Handlers
  const handlePrevPage = () => {
    if (page > 1) fetchOrders(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) fetchOrders(page + 1);
  };

  const handlePageClick = (p) => {
    if (p !== page) fetchOrders(p);
  };

  // Memoized Rows / Cards
  const desktopRows = useMemo(
    () =>
      orders.map((order) => (
        <tr key={order._id}>
          <td>{order._id}</td>
          <td>{order.user?.name || "N/A"}</td>
          <td>{order.user?.email || "N/A"}</td>
          <td>₹{order.totalPrice}</td>
          <td>
            <OrderStatusUpdater
              orderId={order._id}
              currentStatus={order.orderStatus}
              onStatusUpdated={() => fetchOrders(page)}
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
              onClick={() => setDeleteOrderId(order._id)}
            >
              🗑️
            </button>
          </td>
        </tr>
      )),
    [orders, page]
  );

  const mobileCards = useMemo(
    () =>
      orders.map((order) => (
        <div className="order-card" key={order._id}>
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>User:</strong> {order.user?.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {order.user?.email || "N/A"}
          </p>
          <p>
            <strong>Total:</strong> ₹{order.totalPrice}
          </p>
          <div className="card-actions">
            <OrderStatusUpdater
              orderId={order._id}
              currentStatus={order.orderStatus}
              onStatusUpdated={() => fetchOrders(page)}
            />
            <Link to={`/order/${order._id}`}>
              <button className="view-btn">View</button>
            </Link>
            <button
              className="delete-btn"
              onClick={() => setDeleteOrderId(order._id)}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      )),
    [orders, page]
  );

  // Early Returns
  if (loading)
    return <p style={{ textAlign: "center" }}>⏳ Loading orders...</p>;
  if (error)
    return (
      <p style={{ color: "red", textAlign: "center" }}>
        {error} <button onClick={() => fetchOrders(page)}>Retry</button>
      </p>
    );
  if (orders.length === 0)
    return <p style={{ textAlign: "center" }}>No orders found.</p>;

  // Generate page buttons
  const pageButtons = [];
  for (let p = 1; p <= totalPages; p++) {
    pageButtons.push(
      <button
        key={p}
        className={p === page ? "active-page" : ""}
        onClick={() => handlePageClick(p)}
      >
        {p}
      </button>
    );
  }

  return (
    <div className="admin-orders-container">
      <h2>📦 All Orders (Admin)</h2>
      <p className="total-revenue">Total Revenue: ₹{totalAmount}</p>

      {/* Desktop Table */}
      <div className="desktop-orders">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Details</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{desktopRows}</tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-orders">{mobileCards}</div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page === 1}>
          ◀ Previous
        </button>
        {pageButtons}
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next ▶
        </button>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={!!deleteOrderId}
        message="Are you sure you want to delete this order?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOrderId(null)}
      />
    </div>
  );
}

export default AllOrdersPage;
