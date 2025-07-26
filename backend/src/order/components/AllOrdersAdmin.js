import axios from "axios";
import { useEffect, useState } from "react";

const AllOrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/admin/orders",
          { withCredentials: true }
        );
        setOrders(data.orders);
        setTotalAmount(data.totalAmount);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Admin: All Orders</h2>
      <p><strong>Total Revenue:</strong> ₹{totalAmount}</p>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <strong>Order ID:</strong> {order._id} <br />
            <strong>Status:</strong> {order.orderStatus} <br />
            <strong>Total Price:</strong> ₹{order.totalPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllOrdersAdmin;
