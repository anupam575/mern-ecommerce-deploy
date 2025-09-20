import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReviews,
  fetchReviewStats,
  submitReview,
  deleteReviewById,
} from "../utils/reviewApi";
import {
  setReviews,
  setStats,
  setLoading,
} from "../redux/slices/reviewSlice";
import { toast } from "react-toastify";
import ConfirmModal from "../pages/ConfirmModal"; // ✅ import reusable modal
import "./style/ReviewSection.css";

const ReviewSection = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const productId = useSelector((state) => state.product.product?._id);
  const { reviews, stats, loading } = useSelector((state) => state.review);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); // modal show state
  const [reviewToDelete, setReviewToDelete] = useState(null); // which review to delete

  const loadReviews = useCallback(async () => {
    if (!productId) return;
    dispatch(setLoading(true));
    try {
      const { data } = await fetchReviews(productId);
      if (data?.success) dispatch(setReviews(data?.reviews || []));
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, productId]);

  const loadStats = useCallback(async () => {
    if (!productId) return;
    try {
      const { data } = await fetchReviewStats(productId);
      if (data?.success) dispatch(setStats(data));
    } catch {
      toast.error("Failed to load review stats");
    }
  }, [dispatch, productId]);

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [productId, loadReviews, loadStats]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return toast.warn("Provide rating & comment");
    dispatch(setLoading(true));
    try {
      const { data } = await submitReview({ rating, comment, productId });
      if (data?.success) {
        await loadReviews();
        await loadStats();
        toast.success("Review submitted successfully");
        setRating(0);
        setComment("");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit review");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    try {
      const { data } = await deleteReviewById({ productId, reviewId: reviewToDelete });
      if (data?.success) {
        await loadReviews();
        await loadStats();
        toast.success("Review deleted successfully");
      }
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setReviewToDelete(null);
      setShowConfirm(false);
    }
  };

  const renderStars = useCallback(
    (count, interactive = false, onClick) =>
      Array.from({ length: 5 }, (_, i) => {
        const filled = i < (count || 0);
        return interactive ? (
          <button
            key={i}
            type="button"
            className={`star ${filled ? "filled" : ""}`}
            onClick={() => onClick?.(i + 1)}
          >
            ★
          </button>
        ) : (
          <span key={i} className={`star ${filled ? "filled" : ""}`}>
            ★
          </span>
        );
      }),
    []
  );

  if (!productId) return <p>Loading product info...</p>;

  return (
    <div className="review-section">
      <h3>Customer Reviews</h3>

      {/* Rating Summary */}
      <div className="rating-summary">
        <div className="average-rating">
          <span className="big-star">★</span>{" "}
          {stats?.average?.toFixed(1) || 0} out of 5
        </div>
        <div className="total-reviews">{stats?.total || 0} global ratings</div>
        <div className="breakdown">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="breakdown-row">
              <span>{star} star</span>
              <progress
                value={stats?.breakdown?.[star] || 0}
                max={stats?.total || 1}
              />
              <span>{stats?.breakdown?.[star] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="review-form">
          <label>Rating:</label>
          <div className="star-input">{renderStars(rating, true, setRating)}</div>

          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <p>Please login to write a review.</p>
      )}

      <hr />

      {/* Reviews List */}
      <div className="reviews-list">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="review-item skeleton"></div>
          ))
        ) : reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev?._id} className="review-item">
              <div className="review-header">
                <strong>{rev?.user?.name || "Anonymous"}</strong>
                <div className="review-stars">{renderStars(rev?.rating || 0)}</div>
              </div>
              <p className="review-comment">{rev?.comment || ""}</p>

              {rev?.user?._id?.toString() === user?.id?.toString() && (
                <button
                  className="delete-btn"
                  onClick={() => {
                    setReviewToDelete(rev._id);
                    setShowConfirm(true);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* ✅ Confirm Modal */}
      <ConfirmModal
        show={showConfirm}
        message="Are you sure you want to delete this review?"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default ReviewSection;
