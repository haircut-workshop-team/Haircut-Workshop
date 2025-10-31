/**
 * Utility functions for formatting dates, times, currency, and text
 */

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "";

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Parse date string to avoid timezone issues
  // If the date is in format YYYY-MM-DD, parse it as UTC to prevent day shifts
  const dateStr = dateString.split("T")[0]; // Get just the date part
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day); // Create date in local timezone

  return date.toLocaleDateString(undefined, {
    ...defaultOptions,
    ...options,
  });
};

export const formatTime = (timeString) => {
  if (!timeString) return "";

  // Parse time string (HH:MM:SS or HH:MM format)
  const [hours, minutes] = timeString.split(":").map(Number);

  // Format to 12-hour format with AM/PM
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  const displayMinutes = String(minutes).padStart(2, "0");

  return `${displayHours}:${displayMinutes} ${period}`;
};

export const formatCurrency = (amount, currency = "USD", locale = "en-US") => {
  if (amount === null || amount === undefined) return "$0.00";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const truncateText = (text, maxLength = 60) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
