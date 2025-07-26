// src/components/admin/OrderStatusUpdater.jsx

import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const OrderStatusUpdater = ({ orderId, currentStatus, onStatusChange }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.user?.token);

  const handleUpdate = async () => {
    if (!status || status === currentStatus) return;

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:4000/api/v1/admin/order/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("✅ Order status updated.");
      onStatusChange && onStatusChange(); // Optional callback
    } catch (error) {
      alert("❌ Failed to update order.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        disabled={currentStatus === "Delivered"}
      >
        <option value="Processing">Processing</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
      </select>
      <button onClick={handleUpdate} disabled={loading || currentStatus === "Delivered"}>
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
};

export default OrderStatusUpdater;
