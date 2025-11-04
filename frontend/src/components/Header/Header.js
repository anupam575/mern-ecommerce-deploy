import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUserPlus, FaClipboard, FaShoppingCart } from "react-icons/fa";

import SearchBar from "../Dashboard/SearchBar";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = !!user; // ✅ check user login status

  return (
    <header className="main-header">
      {/* Logo */}
      <img src="/logo.png" alt="Logo" className="header-logo" />

      {/* SearchBar */}
      <SearchBar />

      <div className="header-right">
        {/* Avatar: show only when user is logged in */}
        {isAuthenticated && user?.avatar && (
          <Link to="/profiles" className="header-item">
            <img
              src={user.avatar}
              alt={user.name || "avatar"}
              className="header-avatar"
            />
          </Link>
        )}

        {/* Signup/Login icon: always visible */}
        <Link to="/auth" className="header-item signup-link">
          <FaUserPlus style={{ marginRight: "6px" }} />
        </Link>

        {/* Dashboard: always visible */}
        <Link to="/admin" className="header-item dashboard-link">
          <FaClipboard size={20} />
        </Link>

        {/* Cart: always visible */}
        <Link to="/cart" className="carpage">
          <FaShoppingCart />
        </Link>
      </div>
    </header>
  );
};

export default Header;