// ✅ PaymentPage.jsx (Final Debug-Fixed Version)
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import "./paymentPage.css";
import API from "../../utils/axiosInstance";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || "");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items) || [];
  const shippingInfo = useSelector((state) => state.shipping.shippingInfo) || {};

  const [clientSecret, setClientSecret] = useState("");
  const [orderSummary, setOrderSummary] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  // ✅ Create Payment Intent
  useEffect(() => {
    const getClientSecret = async () => {
      if (cartItems.length === 0) return;

      console.log("🛒 Cart Items Before Payment Intent:", cartItems);

      setLoading(true);
      try {
        const { data } = await API.post("/api/v1/payment/process", {
          items: cartItems,
          shippingFee:
            cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) >
            500
              ? 0
              : 50,
        });

        console.log("✅ Payment Intent Response:", data);

        setClientSecret(data.client_secret);
        setOrderSummary(data.orderSummary);
      } catch (error) {
        console.error(
          "❌ Error creating payment intent:",
          error.response?.data || error.message
        );
        setPaymentError("Failed to create payment intent.");
        toast.error("⚠️ Failed to create payment intent");
      } finally {
        setLoading(false);
      }
    };

    getClientSecret();
  }, [cartItems]);

  // ✅ Handle Payment Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaymentError("");
    setLoading(true);
    const card = elements.getElement(CardElement);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        setPaymentError(result.error.message);
        toast.error(`❌ ${result.error.message}`);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        const paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        };

        console.log("💳 Payment Success — Payment Info:", paymentInfo);

        // ✅ FIXED: Correctly map nested product info for backend
        const orderItems = cartItems.map((item, i) => {
          const product = item.product || {};
          const mapped = {
            name: product.name || item.name || item.title || `Unnamed-${i}`,
            quantity: item.quantity || 1,
            image:
              product.images?.[0]?.url ||
              product.image ||
              item.image ||
              item.img ||
              "",
            price: product.price || item.price || 0,
            product: product._id || item.product || item._id || item.id || "unknown",
          };

          if (!mapped.name || !mapped.image || !mapped.price || !mapped.product) {
            console.warn(`⚠️ Invalid item at index ${i}:`, mapped);
          }

          return mapped;
        });

        console.log("🧾 Final Order Data Sent to Backend:", {
          shippingInfo,
          orderItems,
          paymentInfo,
          ...orderSummary,
        });

        try {
          const { data } = await API.post("/api/v1/order/new", {
            shippingInfo,
            orderItems,
            paymentInfo,
            ...orderSummary,
          });

          console.log("✅ Backend Response (Order Created):", data);

          setOrderId(data.order._id);
          setPaymentSucceeded(true);
          toast.success("✅ Payment successful and order placed!");
        } catch (error) {
          console.error("❌ Error placing order:", error.response?.data || error.message);
          setPaymentError("Order placement failed.");
          toast.error("❌ Payment done, but order placement failed!");
        }
      }
    } catch (err) {
      console.error("❌ Payment Processing Error:", err);
      setPaymentError("Payment failed.");
      toast.error("❌ Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Success Screen
  if (paymentSucceeded) {
    return (
      <div className="payment-success-container">
        <h2>✅ Payment Successful!</h2>
        <button
          className="order-detail-btn"
          onClick={() => navigate(`/order/${orderId}`)}
        >
          View Order Full Details
        </button>
      </div>
    );
  }

  // ✅ Payment Form
  return (
    <form onSubmit={handleSubmit} className="payment-form">
      {loading && <p className="loading-text">Processing...</p>}
      <CardElement className="card-element" options={{ hidePostalCode: true }} />
      {paymentError && <p className="payment-error">{paymentError}</p>}
      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className="pay-button"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="payment-container">
        <h2>Payment</h2>
        <CheckoutForm />
      </div>
    </Elements>
  );
};

export default PaymentPage;
