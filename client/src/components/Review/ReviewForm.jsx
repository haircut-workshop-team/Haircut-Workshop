import api from "../../services/api";
import { useState } from "react";
import Swal from "sweetalert2";
import "./ReviewForm.css";

export default function ReviewForm({
  barberId,
  appointmentId,
  existingReview,
  onSuccess,
  onCancel,
}) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      Swal.fire({
        icon: "warning",
        title: "Please select a rating",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      if (existingReview) {
        // Update existing review
        await api.request(`/reviews/${existingReview.id}`, {
          method: "PUT",
          body: { rating, comment },
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Review updated successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        // Create new review
        await api.request("/reviews", {
          method: "POST",
          body: {
            barber_id: barberId,
            appointment_id: appointmentId,
            rating,
            comment,
          },
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Review submitted successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to submit review",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${rating >= star ? "filled" : ""}`}
            onClick={() => setRating(star)}
            style={{ cursor: "pointer" }}
          >
            ⭐
          </span>
        ))}
      </div>
      <textarea
        placeholder="Write your comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      ></textarea>
      <div className="review-form-actions">
        <button type="submit" className="btn-submit" disabled={loading}>
          {existingReview ? "Update" : "Submit"}
        </button>
        {onCancel && (
          <button type="button" className="btn-cancel-form" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
