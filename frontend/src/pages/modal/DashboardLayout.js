import React, { useState } from "react";
import ProductModal from "./ProductModal";
import OrderModel from "./OrderModel";
import AllUser from "./AllUser";
import { Outlet } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "@mui/icons-material"; // ✅ MUI Icons
import "./AdminDashboard.css";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard-container">
      {/* ✅ Arrow toggle button */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        {sidebarOpen ? (
          <ChevronLeft fontSize="large" /> // ← Arrow (to close)
        ) : (
          <ChevronRight fontSize="large" /> // → Arrow (to open)
        )}
      </button>

      {/* ✅ Sidebar */}
      <aside className={`sidebars ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebars-title"> Admin Dashboard</h2>
        </div>

        <ul className="sidebars-menu">
          <ProductModal />
          <OrderModel />
          <AllUser />
        </ul>
      </aside>

      {/* ✅ Main content area */}
      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
