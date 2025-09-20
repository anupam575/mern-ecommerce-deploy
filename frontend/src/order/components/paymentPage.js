// ✅ PaymentPage.jsx (Refactored, no duplicate calculation)
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
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

  useEffect(() => {
    const getClientSecret = async () => {
      setLoading(true);
      try {
        const { data } = await API.post("/api/v1/payment/process", {
          items: cartItems,
          shippingFee: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) > 500 ? 0 : 50,
        });
        setClientSecret(data.client_secret);
        setOrderSummary(data.orderSummary); // backend से summary ले रहे हैं
      } catch (error) {
        console.error("Error creating payment intent:", error.response?.data || error.message);
        setPaymentError("Failed to create payment intent.");
        toast.error("⚠️ Failed to create payment intent");
      } finally {
        setLoading(false);
      }
    };
    getClientSecret();
  }, [cartItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaymentError("");
    setLoading(true);
    const card = elements.getElement(CardElement);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, { payment_method: { card } });

      if (result.error) {
        setPaymentError(result.error.message);
        toast.error(`❌ ${result.error.message}`);
      } else if (result.paymentIntent.status === "succeeded") {
        const paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        };

        const orderData = {
          shippingInfo,
          orderItems: cartItems.map((item) => ({
            name: item.title,
            quantity: item.quantity,
            image: item.img,
            price: item.price,
            product: item.id,
          })),
          paymentInfo,
          ...orderSummary, // backend से आया हुआ summary
        };

        try {
          const { data } = await API.post("/api/v1/order/new", orderData);
          setOrderId(data.order._id);
          setPaymentSucceeded(true);
          toast.success("✅ Payment successful and order placed!");
        } catch (error) {
          console.error("Error placing order:", error.response?.data);
          setPaymentError("Order placement failed.");
          toast.error("❌ Payment done, but order placement failed!");
        }
      }
    } catch (err) {
      console.error(err);
      setPaymentError("Payment failed.");
      toast.error("❌ Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  if (paymentSucceeded) {
    return (
      <div className="payment-success-container">
        <h2>✅ Payment Successful!</h2>
        <button className="order-detail-btn" onClick={() => navigate(`/order/${orderId}`)}>
          View Order Full Details
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      {loading && <p className="loading-text">Processing...</p>}
      <CardElement className="card-element" options={{ hidePostalCode: true }} />
      {paymentError && <p className="payment-error">{paymentError}</p>}
      <button type="submit" disabled={!stripe || loading || !clientSecret} className="pay-button">
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
