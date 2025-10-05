import axios from "axios";

// Axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || " https://mern-ecommerce-deploy-kgzf.onrender.com",
  withCredentials: true, // HttpOnly refresh token
});

let isRefreshing = false; // Flag to indicate refresh in progress
let failedQueue = [];     // Queue to hold failed requests

// Process all queued requests after refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors for requests that haven't been retried
    if (error.response?.status === 401 && !originalRequest._retry) {

      // Prevent retrying refresh-token request itself
      if (originalRequest.url.includes("/refresh-token")) {
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh-token endpoint
        const { data } = await API.get("/api/v1/refresh-token", {
          headers: { "Cache-Control": "no-cache" },
        });

        const newToken = data.accessToken;
        API.defaults.headers.common["Authorization"] = "Bearer " + newToken;

        // Retry all queued requests
        processQueue(null, newToken);

        // Retry the original request
        return API(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
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


