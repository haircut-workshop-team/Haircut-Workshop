/**
 * Utility functions for status classes, icons, and other helpers
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

export const getRoleBadgeClass = (role) => {
  const roleClasses = {
    admin: "role-admin",
    barber: "role-barber",
    customer: "role-customer",
  };
  return roleClasses[role] || "role-customer";
};

export const getStatusText = (status) => {
  if (!status) return "Unknown";

  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getRatingColor = (rating) => {
  if (rating >= 4.5) return "#2ecc71"; // Green
  if (rating >= 3.5) return "#3498db"; // Blue
  if (rating >= 2.5) return "#f39c12"; // Orange
  if (rating >= 1.5) return "#e67e22"; // Dark Orange
  return "#e74c3c"; // Red
};

export const getStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    "⭐".repeat(fullStars) + (hasHalfStar ? "✨" : "") + "☆".repeat(emptyStars)
  );
};

export const getPriorityClass = (priority) => {
  const priorityClasses = {
    low: "priority-low",
    medium: "priority-medium",
    high: "priority-high",
    urgent: "priority-urgent",
  };
  return priorityClasses[priority] || "priority-medium";
};

export const getInitials = (name) => {
  if (!name) return "?";

  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const getAvatarUrl = (avatarUrl, name = "") => {
  if (avatarUrl) return avatarUrl;

  // Generate placeholder with initials
  const initials = getInitials(name);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=random`;
};

export const isToday = (dateString) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isPastDate = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
};

export const sortByDate = (array, dateField, ascending = false) => {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[dateField]);
    const dateB = new Date(b[dateField]);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const generateColor = (seed = "") => {
  const colors = [
    "#3498db",
    "#2ecc71",
    "#e74c3c",
    "#f39c12",
    "#9b59b6",
    "#1abc9c",
    "#34495e",
    "#e67e22",
  ];

  if (!seed) {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Generate consistent color based on seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
