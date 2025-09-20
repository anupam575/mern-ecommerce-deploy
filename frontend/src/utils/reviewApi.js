import API from "../utils/axiosInstance";

const BASE_PATH = "/api/v1";

// Fetch reviews
export const fetchReviews = (productId) =>
  API.get(`${BASE_PATH}/reviews?id=${productId}`);

// Fetch stats
export const fetchReviewStats = (productId) =>
  API.get(`${BASE_PATH}/reviews/stats?productId=${productId}`);

// Create or Update review (PUT /review)
export const submitReview = ({ rating, comment, productId }) =>
  API.put(`${BASE_PATH}/review`, { rating, comment, productId });

// utils/reviewApi.js
export const deleteReviewById = ({ productId, reviewId }) =>
  API.delete(`${BASE_PATH}/review?productId=${productId}&id=${reviewId}`);
