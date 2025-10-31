import { Link } from "react-router-dom";
import "./ServiceCard.css";

export default function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <div className="service-image">
        <img
          src={service.image_url || "/default-service.jpg"}
          alt={service.name}
        />
      </div>

      <div className="service-info">
        <h3>{service.name}</h3>

        <div className="service-buttons">
          <Link
            to={`/services/${service.id}`}
            className="btn btn-primary"
            onClick={() => window.scrollTo(0, 0)}
          >
            View Details
          </Link>
          <Link
            to={`/booking`}
            className="btn btn-book"
            onClick={() => window.scrollTo(0, 0)}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
