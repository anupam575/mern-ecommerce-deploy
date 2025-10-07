import axios from "axios";

// ✅ Base URL handling
const BASE_URL = process.env.REACT_APP_API_URL?.trim() || "https://mern-ecommerce-deploy-kgzf.onrender.com";

// Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // cookies automatically sent
});

let isRefreshing = false; // Flag to indicate refresh in progress
let failedQueue = [];     // Queue to hold failed requests

// Process queued requests after refresh
const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

// Response interceptor
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      // Prevent infinite loop on refresh-token endpoint
      if (originalRequest.url.includes("/refresh-token")) {
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(() => API(originalRequest)) // retry after refresh
        .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh-token endpoint (cookies sent automatically)
        await API.get("/api/v1/refresh-token", {
          headers: { "Cache-Control": "no-cache" },
        });

        processQueue(null);

        return API(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError);
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;

