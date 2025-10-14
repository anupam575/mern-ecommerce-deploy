import React, { useState } from "react";
import ProductModal from "./ProductModal";
import OrderModel from "./OrderModel";
import AllUser from "./AllUser";
import { Outlet } from "react-router-dom";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi"; // ✅ Import arrow icons
import "./AdminDashboard.css";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard-container">
      {/* ✅ Arrow toggle button */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        {sidebarOpen ? (
          <FiArrowLeft size={26} /> // ← Arrow (to close)
        ) : (
          <FiArrowRight size={26} /> // → Arrow (to open)
        )}
      </button>

      {/* ✅ Sidebar */}
      <aside className={`sidebars ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebars-title">🚀 Admin Dashboard</h2>
        </div>

        <ul className="sidebars-menu">
          <ProductModal />
          <OrderModel />
          <AllUser />
        </ul>
      </aside>

      {/* ✅ Main content area (no click close now) */}
      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        <Outlet />
      </main>

      {/* ❌ Overlay removed — sidebar will not auto-close on touch */}
    </div>
  );
};

export default DashboardLayout;
