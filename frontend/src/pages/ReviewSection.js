import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style/ReviewSection.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReviewSection = ({ productId, user, onReviewSubmit }) => {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/reviews?id=${productId}`
      );
      setReviews(data.reviews);

      const myReview = data.reviews.find((rev) => rev.user === user?._id);

      if (myReview) {
        setUserReview(myReview);
        setRating(myReview.rating);
        setComment(myReview.comment);
      } else {
        setUserReview(null);
        setRating(0);
        setComment("");
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  const handleRatingClick = (star) => {
    setRating(star);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        `http://localhost:4000/api/v1/review`,
        {
          rating,
          comment,
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchReviews(); // ✅ सबसे पहले reviews fetch करो
      onReviewSubmit?.();
      toast.success("✅ Review submitted successfully!");

      // ✅ अब comment box reset करो — userReview मत हटाओ!
      setComment("");
      setRating(0);
      // ❌ setUserReview(null); ← इसको बिलकुल न चलाओ
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Delete your review?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:4000/api/v1/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: userReview._id,
          productId: productId,
        },
      });

      // setUserReview(null);
      setRating(0);
      setComment("");
      await fetchReviews();
      onReviewSubmit?.();
      toast.info("🗑️ Review deleted!");
    } catch (err) {
      toast.error("❌ Delete failed");
    }
  };

  useEffect(() => {
    if (productId && user?._id) {
      fetchReviews();
    }
  }, [productId, user?._id]);

  return (
    <div className="review-section">
      <ToastContainer position="top-right" autoClose={2500} />

      <h3 className="review-heading">Customer Reviews</h3>

      {reviews.length === 0 ? (
        <p className="no-review">No reviews yet.</p>
      ) : (
        <div className="review-list">
          {reviews.map((rev) => (
            <div key={rev._id} className="review-card">
              <div className="review-header">
                <strong>{rev.name}</strong>
                <span className="review-rating">
                  {"★".repeat(rev.rating)} {"☆".repeat(5 - rev.rating)}
                </span>
              </div>
              <p className="review-comment">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}

      {user && (
        <form onSubmit={handleSubmit} className="review-form">
          <h4>{userReview ? "Update Your Review" : "Write a Review"}</h4>

          <div className="star-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRatingClick(star)}
                className={`star ${star <= rating ? "filled" : ""}`}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            className="comment-box"
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <div className="review-buttons">
            <button type="submit" disabled={loading}>
              {userReview ? "Update Review" : "Submit Review"}
            </button>
            {userReview && (
              <button
                type="button"
                className="delete-btn"
                onClick={handleDelete}
              >
                Delete Review
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewSection;
