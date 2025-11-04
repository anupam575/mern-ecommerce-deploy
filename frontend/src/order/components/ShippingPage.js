import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ useRouter → useNavigate
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
  const navigate = useNavigate(); // ✅ React Router navigation
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const savedShipping = useSelector((state) => state.shipping.shippingInfo);

  const [shippingInfo, setShippingInfo] = useState(savedShipping || initialShipping);

  // ✅ Validation
  const isPhoneValid = (phone) => /^\d{10}$/.test(phone);
  const isFormValid = () => {
    const allFilled = Object.values(shippingInfo).every((val) => val.trim() !== "");
    return allFilled && isPhoneValid(shippingInfo.phoneNo);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNo" && !/^\d*$/.test(value)) return;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceed = (type) => {
    if (!isFormValid()) {
      toast.error("❌ Please fill all fields correctly.");
      return;
    }

    dispatch(saveShippingInfo(shippingInfo));

    if (type === "payment") {
      navigate("/payment");
    } else {
      navigate("/cod");
    }
  };

  return (
    <div className="shipping-container">
      <h2>📦 Shipping Details</h2>
      <form className="shipping-form">
        {formFields.map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              value={shippingInfo[field.name]}
              placeholder={field.label}
              onChange={handleChange}
              required
              maxLength={field.maxLength || undefined}
            />
            {field.name === "phoneNo" &&
              shippingInfo.phoneNo !== "" &&
              !isPhoneValid(shippingInfo.phoneNo) && (
                <p className="error-text">Phone number must be 10 digits</p>
              )}
          </div>
        ))}

        <div className="button-group">
          <button
            type="button"
            className="btn btn-payment"
            disabled={cartItems.length === 0 || !isFormValid()}
            onClick={() => handleProceed("payment")}
          >
            Proceed to Payment
          </button>

          <button
            type="button"
            className="btn btn-cod"
            disabled={cartItems.length === 0 || !isFormValid()}
            onClick={() => handleProceed("cod")}
          >
            Cash on Delivery
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingPage;
