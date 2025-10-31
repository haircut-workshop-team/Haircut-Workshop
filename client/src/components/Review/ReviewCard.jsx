import api from "../../services/api";
import Swal from "sweetalert2";
import "./ReviewCard.css";

export default function ReviewCard({
  review,
  currentUserId,
  onUpdate,
  onDelete,
}) {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.request(`/reviews/${review.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: "success",
        title: "Review deleted successfully",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      if (onDelete) onDelete(review.id);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to delete review",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-customer-info">
          <strong>{review.customer_name}</strong>
          <span className="review-date">
            {new Date(review.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="review-rating">
        {"⭐".repeat(review.rating)} {"☆".repeat(5 - review.rating)}
      </div>
      {review.comment && <p className="review-comment">{review.comment}</p>}

      {currentUserId === review.customer_id && (
        <div className="review-actions">
          <button className="btn-edit" onClick={() => onUpdate(review)}>
            Edit
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
