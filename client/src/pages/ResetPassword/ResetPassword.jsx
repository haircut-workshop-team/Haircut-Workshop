import api from "../../services/api";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { checkPasswordStrength } from "../../utils/passwordStrength";
import PasswordStrength from "../../components/PasswordStrength/PasswordStrength";
import "./ResetPassword.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 0,
    label: "",
    color: "",
    checks: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPasswords({
      ...passwords,
      [name]: value,
    });

    // Check password strength for new password
    if (name === "newPassword") {
      const result = checkPasswordStrength(value);
      setPasswordStrength(result);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate passwords match
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check password strength
    if (passwordStrength.strength < 60) {
      setError("Please choose a stronger password");
      return;
    }

    setLoading(true);

    try {
      const response = await api.request("/auth/reset-password", {
        method: "POST",
        body: {
          token,
          newPassword: passwords.newPassword,
        },
      });

      setMessage(response.message);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Invalid or expired reset token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container reset-password-container">
        <h2>Reset Password</h2>
        <p className="subtitle">Enter your new password</p>

        {message && (
          <div className="success-message">
            {message}
            <p>Redirecting to login...</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              autoComplete="new-password"
              disabled={loading}
              required
            />
          </div>

          <PasswordStrength
            password={passwords.newPassword}
            strength={passwordStrength.strength}
            label={passwordStrength.label}
            color={passwordStrength.color}
            checks={passwordStrength.checks}
          />

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              autoComplete="new-password"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
