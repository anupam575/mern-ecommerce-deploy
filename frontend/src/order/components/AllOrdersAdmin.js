import { useEffect, useState } from "react";
import API from "../../utils/axiosInstance";
import "./AllOrdersAdmin.css";
import { toast } from "react-toastify";

const AllOrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const { data } = await API.get("/api/v1/admin/orders");
        setOrders(data.orders);
        setTotalAmount(data.totalAmount);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
        toast.error(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, []);

  if (loading) return <p>⏳ Loading orders...</p>;
  if (!orders.length) return <p>No orders found.</p>;

  return (
    <div className="all-orders-container">
      <h2>Admin: All Orders</h2>
      <p className="total-revenue">
        <strong>Total Revenue:</strong> ₹{totalAmount}
      </p>
      <ul className="order-list">
        {orders.map((order) => (
          <li key={order._id} className="order-item">
            <strong>Order ID:</strong> {order._id} <br />
            <strong>Status:</strong> {order.orderStatus} <br />
            <strong>Total Price:</strong> ₹{order.totalPrice} <br />
            <strong>User:</strong> {order.user?.name || "N/A"} <br />
            <strong>Email:</strong> {order.user?.email || "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllOrdersAdmin;
