/**
 * Utility functions for status classes, icons
 */

export const getStatusBadgeClass = (status) => {
  const statusClasses = {
    pending: "status-pending",
    confirmed: "status-confirmed",
    completed: "status-completed",
    cancelled: "status-cancelled",
    "no-show": "status-no-show",
  };
  return statusClasses[status] || "status-pending";
};

export const getActivityIcon = (type) => {
  const icons = {
    user_registered: "👤",
    appointment_created: "📅",
    appointment_updated: "📝",
    appointment_cancelled: "❌",
    review_added: "⭐",
    service_created: "💈",
    service_updated: "✏️",
    service_deleted: "🗑️",
    barber_added: "✂️",
    payment_received: "💰",
  };
  return icons[type] || "📌";
};

// Get user initials from full name
export const getInitials = (name) => {
  if (!name) return "?";

  const names = name.trim().split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return (
    names[0].charAt(0).toUpperCase() +
    names[names.length - 1].charAt(0).toUpperCase()
  );
};
