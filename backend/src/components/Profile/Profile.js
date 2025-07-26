import React from "react";
import { useNavigate } from "react-router-dom";
import GetUser from "./GetUser";
import UpdatePassword from "./UpdatePassword";
import UpdateProfile from "./UpdateProfile";

function Profile() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "80px auto 20px", // 🟢 Top margin added
        padding: "20px"
      }}
    >
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <button
          onClick={handleBack}
          style={{
            backgroundColor: "#f0f0f0",
            border: "none",
            padding: "8px 12px",
            fontSize: "14px",
            cursor: "pointer",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            marginTop: "15px",
             marginLeft: "-150px"
          }}
        >
          ⬅ Back
        </button>
      </div>


      <GetUser />
      <UpdateProfile />
      <UpdatePassword />
    </div>
  );
}

export default Profile;
