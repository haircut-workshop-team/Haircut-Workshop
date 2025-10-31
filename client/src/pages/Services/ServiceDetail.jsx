import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import serviceService from "../../services/serviceService";
import "./ServiceDetail.css";

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await serviceService.getServiceById(id);
      setService(data);
    } catch (err) {
      console.error("Fetch service error:", err);
      setError(err.message || "Failed to load service details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="service-detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="service-detail-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-text">{error}</p>
          <div className="error-actions">
            <button onClick={fetchService} className="btn btn-primary">
              Try Again
            </button>
            <Link to="/services" className="btn btn-secondary">
              Back to Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="service-detail-page">
        <div className="error-container">
          <div className="error-icon">🔍</div>
          <h3>Service Not Found</h3>
          <p className="error-text">
            The service you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/services" className="btn btn-primary">
            Browse All Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="service-detail-page">
      <div className="service-detail-container">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="back-nav-btn">
          ← Back
        </button>

        <div className="service-detail-card">
          {/* Service Image */}
          {service.image_url ? (
            <div className="service-detail-image">
              <img
                src={service.image_url}
                alt={service.name}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600x400?text=Service+Image";
                }}
              />
            </div>
          ) : (
            <div className="service-detail-image no-image">
              <div className="no-image-placeholder">
                <span className="icon">✂️</span>
                <p>No image available</p>
              </div>
            </div>
          )}

          {/* Service Info */}
          <div className="service-detail-info">
            <div className="service-header">
              <h1>{service.name}</h1>
              <span className="service-id">ID: {service.id}</span>
            </div>

            <p className="service-description">{service.description}</p>

            <div className="service-meta">
              <div className="meta-item price-item">
                <span className="meta-label">Price</span>
                <span className="meta-value price">
                  ${Number(service.price).toFixed(2)}
                </span>
              </div>
              <div className="meta-item duration-item">
                <span className="meta-label">Duration</span>
                <span className="meta-value duration">
                  {service.duration} minutes
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="service-actions">
              <Link to={`/book/${service.id}`} className="btn btn-book">
                <span className="btn-icon">📅</span>
                <span>Book This Service</span>
              </Link>
              <Link to="/services" className="btn btn-secondary">
                <span className="btn-icon">👁️</span>
                <span>View All Services</span>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="service-features">
              <h3>What's Included:</h3>
              <ul>
                <li>✅ Professional service by experienced barbers</li>
                <li>✅ High-quality products and tools</li>
                <li>✅ Comfortable and clean environment</li>
                <li>✅ Flexible scheduling options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
