import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-title">🚀 Admin Dashboard</h2>
      <div className="admin-buttons">
        <Link to="/admin-panel" className="admin-btn">
          👥 Manage Users
        </Link>
        <Link to="/admin-products" className="admin-btn">
          📦 Manage Products
        </Link>
        <Link to="/admin/orders" className="admin-btn">
          📦 View All Orders
        </Link>
        <Link to="/admin/create-product" className="admin-btn">Create Product</Link>

        

      </div>
    </div>
  );
};

export default AdminDashboard;
