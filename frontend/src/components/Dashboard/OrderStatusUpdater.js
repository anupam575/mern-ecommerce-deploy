import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../utils/axiosInstance";
import ConfirmModal from "../../pages/ConfirmModal"; // ✅ Reusable modal import
import "./OrderStatusUpdater.css";

const statusOptions = ["Processing", "Shipped", "Delivered"];

const OrderStatusUpdater = ({ orderId, currentStatus, onStatusChange }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleUpdateClick = () => {
    if (!status || status === currentStatus || currentStatus === "Delivered") return;
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    setLoading(true);
    try {
      await API.put(`/api/v1/admin/order/${orderId}`, { status });
      toast.success("✅ Order status updated successfully");
      onStatusChange && onStatusChange();
    } catch (err) {
      console.error("❌ Failed to update order:", err);
      toast.error(err.response?.data?.message || "❌ Failed to update order");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="order-status-container">
      <select
        className="status-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        disabled={currentStatus === "Delivered" || loading}
        aria-label="Update order status"
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button
        className="update-btn"
        onClick={handleUpdateClick}
        disabled={loading || status === currentStatus || currentStatus === "Delivered"}
        aria-label="Update order status"
      >
        {loading ? "Updating..." : "Update"}
      </button>

      <ConfirmModal
        show={showModal}
        message={`Are you sure you want to change status from ${currentStatus} to ${status}?`}
        onConfirm={confirmUpdate}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
};

export default OrderStatusUpdater;
