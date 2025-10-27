import { Link } from "react-router-dom";
import "./ServiceCard.css";

export default function ServiceCard({ service }) {
  // Safety check: Prevent crashes if service prop is undefined
  if (!service) {
    return null;
  }

  // Extract scroll behavior to avoid duplication
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="service-card">
      {/* Service Image */}
      <div className="service-image">
        <img
          src={service.image_url || "/default-service.jpg"}
          alt={`${service.name} service`}
          loading="lazy"
        />
      </div>

      <div className="service-info">
        <h3>{service.name}</h3>

        {/* Uncomment if you want to show description, price, and duration */}
        {/* <p>{service.description?.slice(0, 70)}...</p>
        <div className="service-meta">
          <span className="price">{Number(service.price).toFixed(2)} JOD</span>
          <span className="duration">{service.duration} min</span>
        </div> */}

        <div className="service-buttons">
          <Link
            to={`/services/${service.id}`}
            className="btn btn-primary"
            onClick={handleClick}
          >
            View Details
          </Link>
          <Link
            to={`/book/${service.id}`}
            className="btn btn-book"
            onClick={handleClick}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
