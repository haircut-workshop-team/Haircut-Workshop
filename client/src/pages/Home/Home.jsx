import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Home.css";

export default function Home({ user }) {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to Haircut Workshop</h1>
        <p>Professional barber services at your convenience</p>

        {user ? (
          <div className="hero-buttons">
            <h3>Hello, {user.name}!</h3>
            {user.role === "customer" && (
              <>
                <Link to="/services" className="btn btn-primary">
                  Browse Services
                </Link>
                <Link to="/my-bookings" className="btn btn-secondary">
                  My Bookings
                </Link>
              </>
            )}
            {user.role === "barber" && (
              <Link to="/barber/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            )}
            {user.role === "admin" && (
              <Link to="/admin/dashboard" className="btn btn-primary">
                Go to Admin Panel
              </Link>
            )}
          </div>
        ) : (
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        )}
      </section>

      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Professional Barbers</h3>
            <p>Experienced barbers with years of expertise</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Easy Booking</h3>
            <p>Book your appointment online in minutes</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Quality Service</h3>
            <p>Top-rated services and customer satisfaction</p>
          </div>
        </div>
      </section>
    </div>
  );
}

Home.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    role: PropTypes.oneOf(["customer", "barber", "admin"]).isRequired,
  }),
};
