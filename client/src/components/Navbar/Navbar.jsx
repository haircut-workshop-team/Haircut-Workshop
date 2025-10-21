import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "./Navbar.css";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <h2>Haircut Workshop</h2>
        </Link>

        <ul className="nav-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
          {user ? (
            <>
              {/* Customer links */}
              {user.role === "customer" && (
                <>
                  <li>
                    <Link to="/booking">Book Now</Link>
                  </li>
                  <li>
                    <Link to="/my-bookings">My Bookings</Link>
                  </li>
                </>
              )}

              {/* Barber links */}
              {user.role === "barber" && (
                <>
                  <li>
                    <Link to="/barber/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/barber/schedule">Schedule</Link>
                  </li>
                  <li>
                    <Link to="/barber/appointments">Appointments</Link>
                  </li>
                </>
              )}

              {/* Admin links */}
              {user.role === "admin" && (
                <>
                  <li>
                    <Link to="/admin/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/admin/barbers">Manage Barbers</Link>
                  </li>
                  <li>
                    <Link to="/admin/services">Manage Services</Link>
                  </li>
                </>
              )}

              {/* Common authenticated links */}
              <li>
                <Link to="/profile">Profile ({user.name})</Link>
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
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
