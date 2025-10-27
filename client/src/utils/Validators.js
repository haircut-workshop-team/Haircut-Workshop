/**
 * Utility functions for form validation
 */

export const isValidEmail = (email) => {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  if (!phone) return false;

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Check if it's 10 or 11 digits (with or without country code)
  return cleaned.length >= 10 && cleaned.length <= 11;
};

export const isValidUrl = (url) => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidPrice = (price) => {
  if (price === null || price === undefined || price === "") return false;

  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  // Check if it's a positive number
  if (isNaN(numPrice) || numPrice < 0) return false;

  // Check if it has max 2 decimal places
  const decimalPlaces = (numPrice.toString().split(".")[1] || "").length;
  return decimalPlaces <= 2;
};

export const isValidDuration = (duration) => {
  if (duration === null || duration === undefined || duration === "")
    return false;

  const numDuration =
    typeof duration === "string" ? parseInt(duration) : duration;

  return Number.isInteger(numDuration) && numDuration > 0 && numDuration <= 480; // Max 8 hours
};

export const isValidFutureDate = (dateString) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date >= today;
};

export const validatePassword = (password) => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_+=\-[\]\\/'~`]/.test(password),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;

  return {
    isValid: passedChecks >= 3, // At least 3 requirements must be met
    checks,
    strength: passedChecks,
  };
};

export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const hasMinLength = (value, minLength) => {
  if (!value) return false;
  return value.trim().length >= minLength;
};

export const hasMaxLength = (value, maxLength) => {
  if (!value) return true;
  return value.trim().length <= maxLength;
};

export const isInRange = (value, min, max) => {
  if (value === null || value === undefined || value === "") return false;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return !isNaN(num) && num >= min && num <= max;
};

export const isValidTime = (time) => {
  if (!time) return false;

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const isValidTimeSlot = (date, time) => {
  if (!date || !time) return false;

  const appointmentDateTime = new Date(`${date}T${time}`);
  const now = new Date();

  return appointmentDateTime > now;
};

export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword && password.length > 0;
};

export const sanitizeInput = (input) => {
  if (!input) return "";

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = data[field];
    const fieldRules = rules[field];

    if (fieldRules.required && !isRequired(value)) {
      errors[field] = `${field} is required`;
      return;
    }

    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = "Invalid email format";
      return;
    }

    if (fieldRules.phone && !isValidPhone(value)) {
      errors[field] = "Invalid phone number";
      return;
    }

    if (fieldRules.minLength && !hasMinLength(value, fieldRules.minLength)) {
      errors[field] = `Minimum ${fieldRules.minLength} characters required`;
      return;
    }

    if (fieldRules.maxLength && !hasMaxLength(value, fieldRules.maxLength)) {
      errors[field] = `Maximum ${fieldRules.maxLength} characters allowed`;
      return;
    }

    if (fieldRules.url && !isValidUrl(value)) {
      errors[field] = "Invalid URL format";
      return;
    }

    if (fieldRules.price && !isValidPrice(value)) {
      errors[field] = "Invalid price format";
      return;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
