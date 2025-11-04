import { toast } from "react-toastify";
import API from "../utils/axiosInstance"; // ✅ centralized axios instance

const deleteOrderById = async (orderId) => {
  try {
    const response = await API.delete(`/api/v1/admin/order/${orderId}`);

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

export default deleteOrderById;
