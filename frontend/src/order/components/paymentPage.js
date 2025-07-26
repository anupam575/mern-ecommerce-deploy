import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast, ToastContainer } from "react-toastify"; // ✅ Toastify
import "react-toastify/dist/ReactToastify.css"; // ✅ Toastify CSS

import "./paymentPage.css";

const stripePromise = loadStripe("pk_test_51RdbCrCZNtOeDJwXUTYTDQZ7Gc8EYcubDyJKFZfn4p7lZl0zjI85iioquOMbMq5VphcVcRS7nI6mOWOWqABtC4K300NEXZMr3F");

const CheckoutForm = ({ amount, orderItems, shippingInfo, prices }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.user?.token);

  const [clientSecret, setClientSecret] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const getClientSecret = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:4000/api/v1/payment/process",
          { amount },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setClientSecret(data.client_secret);
      } catch (error) {
        setPaymentError("Failed to get payment intent.");
        toast.error("⚠️ Failed to create payment intent");
      }
    };
    getClientSecret();
  }, [amount, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaymentError("");
    const card = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
      },
    });

    if (result.error) {
      setPaymentError(result.error.message);
      toast.error(`❌ ${result.error.message}`);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        const paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        };

        const orderData = {
          shippingInfo,
          orderItems,
          paymentInfo,
          ...prices,
        };

        try {
          const { data } = await axios.post(
            "http://localhost:4000/api/v1/order/new",
            orderData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          setOrderId(data.order._id);
          setPaymentSucceeded(true);
          toast.success("✅ Payment successful and order placed!");
        } catch (error) {
          setPaymentError("Order placement failed.");
          toast.error("❌ Payment done, but order placement failed!");
        }
      }
    }
  };

  if (paymentSucceeded) {
    return (
      <div className="payment-success-container">
        <ToastContainer />
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

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <ToastContainer />
      <CardElement
        className="card-element"
        options={{ hidePostalCode: true }}
      />
      {paymentError && <p className="payment-error">{paymentError}</p>}
      <button type="submit" disabled={!stripe} className="pay-button">
        Pay Now
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const shippingInfo = useSelector((state) => state.shipping.shippingInfo);

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const orderItems = cartItems.map((item) => ({
    name: item.title,
    quantity: item.quantity,
    image: item.img,
    price: item.price,
    product: item.id,
  }));

  return (
    <Elements stripe={stripePromise}>
      <div className="payment-container">
        <h2>Total Amount: ₹{totalPrice}</h2>
        <CheckoutForm
          amount={Math.round(totalPrice * 100)}
          orderItems={orderItems}
          shippingInfo={shippingInfo}
          prices={{ itemsPrice, taxPrice, shippingPrice, totalPrice }}
        />
      </div>
    </Elements>
  );
};

export default PaymentPage;
