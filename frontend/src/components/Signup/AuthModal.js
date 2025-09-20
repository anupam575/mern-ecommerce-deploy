import React, { useState, useEffect } from "react";
import Login from "../../User/Login";
import Register from "../../User/Register";
import "./authModal.css";

const AuthModal = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState("login");

  // ✅ Escape key listener
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()} // ✅ backdrop click closes modal
      >
        <button className="modal-close-btn" onClick={closeModal} aria-label="Close Modal">
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
