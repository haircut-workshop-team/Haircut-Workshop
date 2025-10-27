/**
 * Central export point for all utility functions
 * Import from: import { formatDate, formatCurrency, ... } from '../../utils';
 */

// Formatters
export {
  formatDate,
  formatTime,
  formatCurrency,
  truncateText,
  formatRelativeTime,
  formatPhoneNumber,
  capitalizeWords,
  formatDuration,
} from "./Formatters";

// Helpers
export {
  getStatusBadgeClass,
  getActivityIcon,
  getRoleBadgeClass,
  getStatusText,
  getRatingColor,
  getStarRating,
  getPriorityClass,
  getInitials,
  getAvatarUrl,
  isToday,
  isPastDate,
  sortByDate,
  debounce,
  generateColor,
} from "./Helpers";

// Validators
export {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isValidPrice,
  isValidDuration,
  isValidFutureDate,
  validatePassword,
  isRequired,
  hasMinLength,
  hasMaxLength,
  isInRange,
  isValidTime,
  isValidTimeSlot,
  passwordsMatch,
  sanitizeInput,
  validateForm,
} from "./Validators";

// Password Strength (existing)
export { checkPasswordStrength } from "./PasswordStrength";
