import api from "../../services/api";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ReviewForm from "../Review/ReviewForm";
import ReviewCard from "../Review/ReviewCard";
import "./AppointmentCard.css";

export default function AppointmentCard({ appointment, onCancelSuccess }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await api.request(`/reviews/barber/${appointment.barber_id}`);
      setReviews(res.reviews || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = () => {
    Swal.fire({
      title: "Cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await api.request(`/appointments/${appointment.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire(
            "Cancelled!",
            "Your appointment has been cancelled.",
            "success"
          );
          if (onCancelSuccess) onCancelSuccess();
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Failed to cancel appointment", "error");
        }
      }
    });
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    fetchReviews();
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  return (
    <div className="appointment-card">
      <h4>{appointment.service_name}</h4>
      <p>
        <strong>Barber:</strong> {appointment.barber_name}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(appointment.appointment_date).toDateString()}
      </p>
      <p>
        <strong>Time:</strong> {appointment.appointment_time}
      </p>
      <p>
        <strong>Status:</strong> {appointment.status}
      </p>

      {appointment.status === "pending" ||
      appointment.status === "confirmed" ? (
        <button className="btn-cancel" onClick={handleCancel}>
          Cancel Appointment
        </button>
      ) : null}

      {appointment.status === "completed" && !showReviewForm && (
        <button className="btn-review" onClick={() => setShowReviewForm(true)}>
          {editingReview ? "Edit Review" : "Write Review"}
        </button>
      )}

      {showReviewForm && (
        <ReviewForm
          barberId={appointment.barber_id}
          appointmentId={appointment.id}
          existingReview={editingReview}
          onSuccess={handleReviewSuccess}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {reviews.length > 0 && (
        <div className="appointment-reviews">
          <h5>Reviews for {appointment.barber_name}:</h5>
          {reviews.map((rev) => (
            <ReviewCard
              key={rev.id}
              review={rev}
              currentUserId={appointment.customer_id}
              onUpdate={handleEditReview}
              onDelete={fetchReviews}
            />
          ))}
        </div>
      )}
    </div>
  );
}
