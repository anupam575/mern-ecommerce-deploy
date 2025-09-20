// 🚀 ShippingPage.jsx (Refactored)
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { saveShippingInfo } from "../../redux/slices/shippingSlice";
import "./ShippingPage.css";

const initialShipping = {
  address: "",
  city: "",
  state: "",
  country: "",
  pinCode: "",
  phoneNo: "",
};

const formFields = [
  { name: "address", label: "Address", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "state", label: "State", type: "text" },
  { name: "country", label: "Country", type: "text" },
  { name: "pinCode", label: "Pin Code", type: "text" },
  { name: "phoneNo", label: "Phone Number (10 digits)", type: "tel", maxLength: 10 },
];

const ShippingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const savedShipping = useSelector((state) => state.shipping.info);

  const [shippingInfo, setShippingInfo] = useState(savedShipping || initialShipping);

  // 🔹 Validation
  const isPhoneValid = (phone) => /^\d{10}$/.test(phone);
  const isFormValid = () => {
    const allFilled = Object.values(shippingInfo).every((val) => val.trim() !== "");
    return allFilled && isPhoneValid(shippingInfo.phoneNo);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNo") {
      if (value === "" || /^\d*$/.test(value)) {
        setShippingInfo((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setShippingInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("❌ Please fill all fields correctly.");
      return;
    }
    dispatch(saveShippingInfo(shippingInfo));
    navigate("/payment");
  };

  return (
    <div className="shipping-container">
      {/* Shipping Form */}
      <div className="shipping-right">
        <h2>📦 Shipping Address</h2>
        <form onSubmit={handleSubmit} className="shipping-form" noValidate>
          {formFields.map((field) => (
            <div key={field.name} className="form-group">
              <label htmlFor={field.name}>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                placeholder={field.label}
                value={shippingInfo[field.name]}
                onChange={handleChange}
                maxLength={field.maxLength || undefined}
                required
              />
              {field.name === "phoneNo" && shippingInfo.phoneNo !== "" && !isPhoneValid(shippingInfo.phoneNo) && (
                <p className="error-text">Phone number must be 10 digits</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="submit-btn"
            disabled={cartItems.length === 0 || !isFormValid()}
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
