export const checkPasswordStrength = (password) => {
  const POINTS_PER_CHECK = 20;

  // Check each requirement
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_+=\-[\]\\/'~`]/.test(password),
  };

  // Calculate strength (count how many checks passed)
  const strength =
    Object.values(checks).filter(Boolean).length * POINTS_PER_CHECK;

  // Strength level mapping
  const strengthLevels = [
    { max: 20, label: "Very Weak", color: "#e74c3c" },
    { max: 40, label: "Weak", color: "#e67e22" },
    { max: 60, label: "Fair", color: "#f39c12" },
    { max: 80, label: "Good", color: "#3498db" },
    { max: 100, label: "Strong", color: "#2ecc71" },
  ];

  // Find matching strength level
  const level =
    strengthLevels.find((l) => strength <= l.max) || strengthLevels[4];

  return {
    strength,
    label: level.label,
    color: level.color,
    checks,
  };
};
