import axios from "axios";
import { toast } from "react-toastify"; // optional for notifications

const deleteOrderById = async (orderId, token) => {
  try {
    const response = await axios.delete(
      `http://localhost:4000/api/v1/admin/order/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      toast.success("🗑️ Order deleted successfully");
      return true;
    } else {
      toast.error("❌ Failed to delete order");
      return false;
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "❌ Error deleting order");
    return false;
  }
};
export default deleteOrderById 