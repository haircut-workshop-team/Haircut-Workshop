import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { SERVER_URL } from "../../services/api";
import "./Navbar.css";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate("/");
    setIsMenuOpen(false); // Close menu after logout
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <h2>Haircut Workshop</h2>
        </Link>

        {/* Hamburger Button */}
        <button
          className={`hamburger ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/services" onClick={closeMenu}>
              Services
            </Link>
          </li>

          {user ? (
            <>
              {/* Customer links */}
              {user.role === "customer" && (
                <>
                  <li>
                    <Link to="/booking" onClick={closeMenu}>
                      Book Now
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-bookings" onClick={closeMenu}>
                      My Bookings
                    </Link>
                  </li>
                </>
              )}

              {/* Barber links */}
              {user.role === "barber" && (
                <>
                  <li>
                    <Link to="/barber/dashboard" onClick={closeMenu}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/barber/schedule" onClick={closeMenu}>
                      Schedule
                    </Link>
                  </li>
                  <li>
                    <Link to="/barber/appointments" onClick={closeMenu}>
                      Appointments
                    </Link>
                  </li>
                </>
              )}

              {/* Admin links */}
              {user.role === "admin" && (
                <>
                  <li>
                    <Link to="/admin/dashboard" onClick={closeMenu}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/barbers" onClick={closeMenu}>
                      Manage Barbers
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/services" onClick={closeMenu}>
                      Manage Services
                    </Link>
                  </li>
                </>
              )}

              {/* Common authenticated links */}
              <li>
                <Link
                  to="/profile"
                  className="profile-link"
                  onClick={closeMenu}
                >
                  {user.profile_image ? (
                    <img
                      src={`${SERVER_URL}${user.profile_image}`}
                      alt={user.name}
                      className="navbar-avatar"
                    />
                  ) : (
                    <span className="navbar-avatar-placeholder">👤</span>
                  )}
                  <span>{user.name}</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="logout-btn"
                  aria-label="Logout from account"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMenu}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Overlay for mobile menu */}
        {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  );
}
