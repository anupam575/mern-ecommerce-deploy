import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../Signup/AuthModal";

const AuthPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // पूरे page का background sky blue करना
  useEffect(() => {
    document.body.style.backgroundColor = "#87CEEB";

    return () => {
      // जब component unmount हो जाए तो background reset कर दो
      document.body.style.backgroundColor = null;
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px", position: "relative" }}>
      {/* Back button left side */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          left: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          padding: "8px 16px",
          fontSize: "16px",
          backgroundColor: "#ccc",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      {/* Centered login/register button */}
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: "12px 24px",
          fontSize: "18px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          transition: "background-color 0.3s ease",
          display: "block",
          margin: "200px auto",
        }}
      >
        Login / Register
      </button>

      {isModalOpen && <AuthModal closeModal={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default AuthPage;
