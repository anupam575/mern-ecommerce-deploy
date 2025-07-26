// src/components/AuthModal.js

import React, { useState } from "react";
import Login from "../../User/Login";
import Register from "../../User/Register";

import "./authModal.css";

const AuthModal = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={closeModal}>
          ✖
        </button>

        <div className="modal-tabs">
          <button
            className={activeTab === "login" ? "active" : ""}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={activeTab === "register" ? "active" : ""}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        <div className="modal-form">
          {activeTab === "login" ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
