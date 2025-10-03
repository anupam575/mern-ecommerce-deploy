// utils/axiosInstance.js
import axios from "axios";

// ✅ Axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // deployed backend URL
  withCredentials: true,                   // must for HttpOnly cookies
});

// ✅ Refresh token handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ✅ Response interceptor
API.interceptors.response.use(
  response => response,
  async error => {
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
        // Queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return API(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh-token endpoint
        const { data } = await API.get("/api/v1/refresh-token", {
          headers: { "Cache-Control": "no-cache" },
        });

        const newToken = data.accessToken;

        // Set new access token in default headers
        API.defaults.headers.common["Authorization"] = "Bearer " + newToken;

        // Retry all queued requests
        processQueue(null, newToken);

        // Retry original request
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

