import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa"; // ✅ New icon import for "My Orders"

import "./Sidebar.css";

function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  return (
    <>
      <div className="navbar">
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
        <h2 style={{ marginLeft: "10px" }}></h2>
      </div>

      <div className={`sidebar ${open ? "open" : ""}`}>
        <button className="close-btn" onClick={closeMenu}>
          ✖
        </button>
        <ul onClick={closeMenu}>
          <Link
            to="/profile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
              color: "#1f2937", // Slate-800 type modern color
              fontWeight: "600",
              fontSize: "1rem", // Bigger font

              borderRadius: "0.5rem",

              textAlign: "center",
            }}
          >
            <MdAccountCircle size={32} />
            <span>My Account</span>
          </Link>

          {/* ✅ New Link: My Orders */}
          <Link
            to="/my-orders"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
              color: "#1f2937",
              fontWeight: "600",
              fontSize: "1rem",

              borderRadius: "0.5rem",

              marginTop: "0.5rem",
              textAlign: "center",
            }}
          
          >
            <FaBoxOpen size={28} />
            <span>My Orders</span>
          </Link>
        </ul>
      </div>

      {open && <div className="overlay" onClick={closeMenu}></div>}
    </>
  );
}

export default Navbar;
