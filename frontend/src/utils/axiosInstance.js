import axios from "axios";

// ✅ Axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000",
  withCredentials: true, // HttpOnly refresh token
});

// ✅ Response interceptor for automatic token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1️⃣ If response is 401 and request not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 2️⃣ Prevent infinite loop: Don't retry refresh-token request itself
      if (originalRequest.url.includes("/refresh-token")) {
        // Logout user cleanly
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // 3️⃣ Call refresh-token endpoint
        await API.get("/api/v1/refresh-token", {
          headers: { "Cache-Control": "no-cache" }, // avoid 304 caching issues
        });

        // 4️⃣ Retry the original request after successful refresh
        return API(originalRequest);
      } catch (refreshError) {
        // 5️⃣ If refresh fails → logout user
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
