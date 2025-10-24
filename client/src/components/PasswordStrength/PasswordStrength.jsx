import "./PasswordStrength.css";
export default function PasswordStrength({
  password,
  strength,
  label,
  color,
  checks,
}) {
  if (!password) return null;

  return (
    <div className="password-strength-container" aria-live="polite">
      <div className="strength-bar-container">
        <div
          className="strength-bar"
          style={{
            width: `${strength}%`,
            backgroundColor: color,
          }}
        />
      </div>

      <div className="strength-info">
        <span className="strength-label" style={{ color }}>
          {label}
        </span>
        <span className="strength-percentage">{strength}%</span>
      </div>

      <div className="password-requirements">
        <div className={`requirement ${checks?.length ? "met" : ""}`}>
          {checks?.length ? "✓" : "○"} At least 8 characters
        </div>
        <div className={`requirement ${checks?.lowercase ? "met" : ""}`}>
          {checks?.lowercase ? "✓" : "○"} Lowercase letter
        </div>
        <div className={`requirement ${checks?.uppercase ? "met" : ""}`}>
          {checks?.uppercase ? "✓" : "○"} Uppercase letter
        </div>
        <div className={`requirement ${checks?.number ? "met" : ""}`}>
          {checks?.number ? "✓" : "○"} Number
        </div>
        <div className={`requirement ${checks?.special ? "met" : ""}`}>
          {checks?.special ? "✓" : "○"} Special character
        </div>
      </div>
    </div>
  );
}
