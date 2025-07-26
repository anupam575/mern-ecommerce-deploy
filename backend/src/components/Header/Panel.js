// src/components/Panel.js
import React from "react";
import { Link } from "react-router-dom"; // ✅ Link add किया गया
import "./Panel.css";

import Navbar from "./Navbar"; // Optional but useful

const Panel = () => {
  return (
    <div className="panel">
      <Navbar />

      {/* ✅ Link elements add किए गए, कुछ भी remove नहीं किया */}
      <div className="ul">
        <ul>
          <li>
            {" "}
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/product">Product</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/admin/create-product">Create Product</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Panel;
