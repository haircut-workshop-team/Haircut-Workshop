import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.request("/auth/forgot-password", {
        method: "POST",
        body: { email },
      });

      setMessage(response.message);

      // For testing only - show the reset token
      if (response.resetToken) {
        setResetToken(response.resetToken);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container forgot-password-container">
        <h2>Forgot Password</h2>
        <p className="subtitle">
          Enter your email to receive a password reset link
        </p>

        {message && (
          <div className="success-message">
            {message}
            {resetToken && (
              <div className="reset-token-info">
                <p>
                  <strong>For Testing:</strong>
                </p>
                <Link
                  to={`/reset-password/${resetToken}`}
                  className="reset-link"
                >
                  Click here to reset your password
                </Link>
              </div>
            )}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
          <Link to="/register">Don't have an account?</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
