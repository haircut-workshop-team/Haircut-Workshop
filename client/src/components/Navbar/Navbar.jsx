import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);
  const scrollTopAndClose = () => {
    window.scrollTo(0, 0);
    closeMenu();
  };
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo" onClick={scrollTopAndClose}>
          <h2>StyleSync</h2>
        </NavLink>

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

        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <li>
            <NavLink to="/" onClick={scrollTopAndClose}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" onClick={scrollTopAndClose}>
              Services
            </NavLink>
          </li>

          {user ? (
            <>
              {user.role === "customer" && (
                <>
                  <li>
                    <NavLink to="/booking" onClick={scrollTopAndClose}>
                      Book Now
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/my-bookings" onClick={scrollTopAndClose}>
                      My Bookings
                    </NavLink>
                  </li>
                </>
              )}

              {user.role === "barber" && (
                <>
                  <li>
                    <NavLink to="/barber/dashboard" onClick={scrollTopAndClose}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/barber/schedule" onClick={scrollTopAndClose}>
                      Schedule
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/barber/appointments"
                      onClick={scrollTopAndClose}
                    >
                      Appointments
                    </NavLink>
                  </li>
                </>
              )}

              {user.role === "admin" && (
                <>
                  <li>
                    <NavLink to="/admin/dashboard" onClick={scrollTopAndClose}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/barbers" onClick={scrollTopAndClose}>
                      Manage Barbers
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/services" onClick={scrollTopAndClose}>
                      Manage Services
                    </NavLink>
                  </li>
                </>
              )}

              <li>
                <NavLink
                  to="/profile"
                  className="profile-link"
                  onClick={scrollTopAndClose}
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
                </NavLink>
              </li>

              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" onClick={scrollTopAndClose}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" onClick={scrollTopAndClose}>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  );
}
