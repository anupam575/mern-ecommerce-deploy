import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUserPlus, FaClipboard, FaShoppingCart } from "react-icons/fa";

import SearchBar from "../Dashboard/SearchBar";

const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="main-header">
      <img src="/logo.png" alt="Logo" className="header-logo" />




      {/* ✅ SearchBar directly included, no props needed now */}
      <SearchBar />

      <div className="header-right">
        {/* Avatar */}
        {isAuthenticated && user?.avatar?.url && (
          <Link to="/profiles" className="header-item">
            <img src={user.avatar.url} alt="avatar" className="header-avatar" />
          </Link>
        )}

        {/* Signup */}
        <Link to="/auth" className="header-item signup-link">
          <FaUserPlus style={{ marginRight: "6px" }} />
        </Link>

        {/* Dashboard */}
        <Link to="/dashboard" className="header-item dashboard-link">
          <FaClipboard size={20} />
        </Link>

         <Link to="/cart" className="carpage">
          <FaShoppingCart /> 
        </Link>
      </div>
    </header>
  );
};

export default Header;
