import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import authService from "../../services/authService";
import { checkPasswordStrength } from "../../utils/passwordStrength";
import PasswordStrength from "../../components/PasswordStrength/PasswordStrength";
import "./Auth.css";

function Register({ setUser }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 0,
    label: "",
    color: "",
    checks: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Check password strength when password field changes
    if (name === "password") {
      const result = checkPasswordStrength(value);
      setPasswordStrength(result);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.register(formData);

      // Save token
      localStorage.setItem("token", response.data.token);

      // Update user state
      setUser(response.data.user);

      // Redirect to home (all users register as customers)
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Register</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="register-name">Name</label>
            <input
              type="text"
              id="register-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input
              type="email"
              id="register-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              type="password"
              id="register-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="new-password"
              disabled={loading}
              required
            />
          </div>

          <PasswordStrength
            password={formData.password}
            strength={passwordStrength.strength}
            label={passwordStrength.label}
            color={passwordStrength.color}
            checks={passwordStrength.checks}
          />

          <div className="form-group">
            <label htmlFor="register-phone">Phone</label>
            <input
              type="tel"
              id="register-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              autoComplete="tel"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/login" onClick={() => window.scrollTo(0, 0)}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

Register.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Register;
