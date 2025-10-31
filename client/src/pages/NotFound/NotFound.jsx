import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <span className="error-code">404</span>
        </div>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-description">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">
            Go to Home
          </Link>
          <Link to="/services" className="btn-secondary">
            Browse Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
