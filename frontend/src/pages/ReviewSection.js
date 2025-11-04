import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getReviews,
  getReviewStats,
  addReview,
  removeReview,
} from "../redux/slices/reviewSlice";
import { toast } from "react-toastify";
import ConfirmModal from "../pages/ConfirmModal";
import "./style/ReviewSection.css";

const ReviewSection = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const productId = useSelector((state) => state.product?.product?._id);
  const { items: reviews, stats, loading, fetched } = useSelector(
    (state) => state.reviews
  );

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {

    if (!productId) return;
    const fetchData = async () => {
      console.log("Product ID:", productId);

      try {
        await dispatch(getReviews(productId));
        await dispatch(getReviewStats(productId));
      } catch {
        toast.error("Failed to load reviews or stats");
      }
    };
    fetchData();
  }, [dispatch, productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim())
      return toast.warn("Please provide rating and comment");

    try {
      const resultAction = await dispatch(addReview({ productId, rating, comment }));
      if (addReview.fulfilled.match(resultAction)) {
        toast.success("Review submitted");
        setRating(0);
        setComment("");
        await dispatch(getReviews(productId));
        await dispatch(getReviewStats(productId));
      } else {
        toast.error(resultAction.payload || "Failed to submit review");
      }
    } catch {
      toast.error("Failed to submit review");
    }
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    try {
      const resultAction = await dispatch(
        removeReview({ productId, reviewId: reviewToDelete })
      );
      if (removeReview.fulfilled.match(resultAction)) {
        toast.success("Review deleted");
        await dispatch(getReviews(productId));
        await dispatch(getReviewStats(productId));
      } else {
        toast.error(resultAction.payload || "Failed to delete review");
      }
    } finally {
      setReviewToDelete(null);
      setShowConfirm(false);
    }
  };

  const renderStars = (count, interactive = false, onClick) =>
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
    });

  if (!productId) return <p>Loading product info...</p>;

  return (
    <div className="review-section">
      <h3>Customer Reviews</h3>

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
              <progress value={stats?.breakdown?.[star] || 0} max={stats?.total || 1} />
              <span>{stats?.breakdown?.[star] || 0}</span>
            </div>
          ))}
        </div>
      </div>

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

      <div className="reviews-list">
        {!fetched ? (
          <p>Loading reviews...</p>
        ) : loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="review-item skeleton"></div>
          ))
        ) : reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} className="review-item">
              <div className="review-header">
                <strong>{rev?.user?.name || "Anonymous"}</strong>
                <div className="review-stars">{renderStars(rev?.rating || 0)}</div>
              </div>
              <p className="review-comment">{rev?.comment || ""}</p>
              {rev?.user?._id?.toString() === (user?._id || user?.id)?.toString() && (
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
