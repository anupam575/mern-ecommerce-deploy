import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./OrderDetailPage.css";
import API from "../../utils/axiosInstance";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch Order Details
  const fetchOrderDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get(`api/v1/order/${id}`);
      setOrder(res.data.order || null);
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Failed to load order details";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load once when id changes
  useEffect(() => {
    if (id) fetchOrderDetails();
  }, [id]);

  // ✅ Loading & Error states
  if (loading) return <p style={{ textAlign: "center" }}>⏳ Loading order details...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!order) return <p style={{ textAlign: "center" }}>No order found.</p>;

  const Section = ({ title, children }) => (
    <section className="section">
      <h3>{title}</h3>
      {children}
    </section>
  );

  return (
    <div className="order-detail-container">
      <h2>Order Details</h2>

      {/* Shipping Info */}
      <Section title="Shipping Info">
        <p>
          <strong>Address:</strong>{" "}
          {order.shippingInfo?.address}, {order.shippingInfo?.city},{" "}
          {order.shippingInfo?.state}, {order.shippingInfo?.country} -{" "}
          {order.shippingInfo?.pinCode}
        </p>
        <p><strong>Phone:</strong> {order.shippingInfo?.phoneNo}</p>
      </Section>

      {/* User Info */}
      <Section title="User Info">
        <p><strong>Name:</strong> {order.user?.name}</p>
        <p><strong>Email:</strong> {order.user?.email}</p>
      </Section>

      {/* Order Items */}
      {order.orderItems?.length > 0 && (
        <Section title="Order Items">
          <table className="order-items-table" aria-label="Order Items">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Qty</th>
                <th scope="col">Price</th>
                <th scope="col">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{currencyFormatter.format(item.price)}</td>
                  <td>{currencyFormatter.format(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {/* Payment Info */}
      <Section title="Payment Info">
        <p><strong>Status:</strong> {order.paymentInfo?.status || "N/A"}</p>
        <p>
          <strong>Paid At:</strong>{" "}
          {order.paidAt ? new Date(order.paidAt).toLocaleString() : "N/A"}
        </p>
      </Section>

      {/* Price Summary */}
      <Section title="Price Summary">
        <p><strong>Items:</strong> {currencyFormatter.format(order.itemsPrice)}</p>
        <p><strong>Tax:</strong> {currencyFormatter.format(order.taxPrice)}</p>
        <p><strong>Shipping:</strong> {currencyFormatter.format(order.shippingPrice)}</p>
        <p><strong>Total:</strong> {currencyFormatter.format(order.totalPrice)}</p>
      </Section>

      {/* Order Status */}
      <Section title="Order Status">
        <p><strong>Status:</strong> {order.orderStatus}</p>
        {order.orderStatus === "Delivered" && order.deliveredAt && (
          <p>
            <strong>Delivered At:</strong>{" "}
            {new Date(order.deliveredAt).toLocaleString()}
          </p>
        )}
      </Section>
    </div>
  );
};

export default OrderDetailPage;
