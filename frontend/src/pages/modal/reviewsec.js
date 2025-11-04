


import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  fetchReviews,
  fetchReviewStats,
  submitReview,
  deleteReviewById,
} from "../utils/reviewApi";
import { toast } from "react-toastify";
import ConfirmModal from "../pages/ConfirmModal";
import { Star, StarBorder } from "@mui/icons-material";
import "./style/ReviewSection.css";

const ReviewSection = ({ initialReviews = [], initialRating = 0, initialTotal = 0, onUpdateSummary }) => {
  // Logged-in user from Redux
  const user = useSelector((state) => state.auth.user);
  const product = useSelector((state) => state.product.product);
  const productId = product?._id;

  // State variables
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const [averageRating, setAverageRating] = useState(initialRating);
  const [totalReviews, setTotalReviews] = useState(initialTotal);
  const [breakdown, setBreakdown] = useState({1:0,2:0,3:0,4:0,5:0});

  // Update rating summary
  const updateRatingSummary = useCallback((reviewsList) => {
    const total = reviewsList.length;
    const avg = total > 0 ? reviewsList.reduce((sum, r) => sum + r.rating, 0) / total : 0;
    const bd = {1:0,2:0,3:0,4:0,5:0};
    reviewsList.forEach(r => { bd[r.rating] = (bd[r.rating]||0)+1 });
    setAverageRating(avg);
    setTotalReviews(total);
    setBreakdown(bd);
    if (onUpdateSummary) onUpdateSummary(avg, total);
  }, [onUpdateSummary]);

  // Load reviews
  const loadReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const { data } = await fetchReviews(productId);
      if (data?.success) {
        const revs = data.reviews || [];
        setReviews(revs);
        updateRatingSummary(revs);
      }
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [productId, updateRatingSummary]);

  // Load review stats
  const loadStats = useCallback(async () => {
    if (!productId) return;
    try {
      const { data } = await fetchReviewStats(productId);
      if (data?.success){
        setAverageRating(data.average || 0);
        setTotalReviews(data.total || 0);
        setBreakdown(data.breakdown || {1:0,2:0,3:0,4:0,5:0});
      }
    } catch {
      console.error("Failed to load stats");
    }
  }, [productId]);

  // Initial load
  useEffect(() => {
    if (initialReviews.length === 0) {
      loadReviews();
      loadStats();
    }
  }, [loadReviews, loadStats, initialReviews]);

  // Submit review
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return toast.warn("Provide rating & comment");
    setLoading(true);
    try {
      const { data } = await submitReview({ productId, rating, comment });
      if (data?.success) {
        toast.success("Review submitted successfully");
        setRating(0);
        setComment("");
        await loadReviews();
        await loadStats();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  }, [productId, rating, comment, loadReviews, loadStats]);

  // Delete review
  const handleDelete = useCallback(async () => {
    if (!reviewToDelete) return;
    setLoading(true);
    try {
      const { data } = await deleteReviewById({ productId, reviewId: reviewToDelete });
      if (data?.success) {
        toast.success("Review deleted successfully");
        await loadReviews();
        await loadStats();
      }
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setReviewToDelete(null);
      setShowConfirm(false);
      setLoading(false);
    }
  }, [productId, reviewToDelete, loadReviews, loadStats]);

  // Render stars (interactive for form, static for display)
  const renderStars = useCallback((count, interactive=false, onClick) =>
    Array.from({ length: 5 }, (_, i) => {
      const filled = i < (count||0);
      const Icon = filled ? Star : StarBorder;
      return interactive ? (
        <button key={i} type="button" className={`star ${filled ? "filled" : ""}`} onClick={() => onClick?.(i+1)}>
          <Icon />
        </button>
      ) : (
        <span key={i} className={`star ${filled ? "filled" : ""}`}><Icon/></span>
      );
    }), []
  );

  if (!productId) return <p>Loading product info...</p>;

  // Safely get current logged-in user ID
  const currentUserId = (user?._id || user?.id)?.toString();

  return (
    <div className="review-section">
      <h3>Customer Reviews</h3>

      {/* Rating Summary */}
      <div className="rating-summary">
        <div className="average-rating">
          <Star className="big-star" /> {averageRating.toFixed(1)} out of 5
        </div>
        <div className="total-reviews">{totalReviews} reviews</div>
        <div className="breakdown">
          {[5,4,3,2,1].map(star => (
            <div key={star} className="breakdown-row">
              <span>{star} star</span>
              <progress value={breakdown[star] || 0} max={totalReviews || 1}></progress>
              <span>{breakdown[star] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {user && (
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
          reviews.map((rev) => {
            const revUserId = (rev.user?._id || rev.user?.id)?.toString();
            console.log("revUserId:", revUserId, "currentUserId:", currentUserId); // Debug

            return (
              <div key={rev._id} className="review-item">
                <div className="review-header">
                  <strong>{rev.user?.name || "Anonymous"}</strong>
                  <div className="review-stars">{renderStars(rev.rating)}</div>
                </div>
                <p className="review-comment">{rev.comment}</p>

                {/* Delete button for review owner only */}
                {revUserId && currentUserId && revUserId === currentUserId && (
                  <button
                    className="delete-btn"
                    onClick={() => { setReviewToDelete(rev._id); setShowConfirm(true); }}
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Confirm Delete Modal */}
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
