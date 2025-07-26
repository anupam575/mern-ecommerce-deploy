import React from "react";
import { Link } from "react-router-dom";
import "./Panel.css";
import Navbar from "./Navbar";

const Panel = () => {
  return (
    <div className="panel">
      <Navbar />

      <ul className="nav-list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/product">Product</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </div>
  );
};

export default Panel;
