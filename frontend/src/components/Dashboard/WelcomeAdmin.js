import React from "react";
import "./WelcomeAdmin.css"; // External CSS styling

const WelcomeAdmin = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1 className="welcome-title">🚀 Welcome to Admin Dashboard</h1>
        <p className="welcome-subtitle">
          Manage users, products, and orders easily from the sidebar.
        </p>
        <button className="explore-btn">Get Started</button>
      </div>
    </div>
  );
};

export default WelcomeAdmin;
