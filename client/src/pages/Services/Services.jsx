import { useEffect, useState } from "react";
import serviceService from "../../services/serviceService";
import ServiceCard from "../../components/Card/ServiceCard";
import "./Services.css";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await serviceService.getAllServices();
      setServices(data || []);
    } catch (err) {
      console.error("Fetch services error:", err);
      setError(
        err.message || "Failed to load services. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="services-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading our amazing services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-text">{error}</p>
          <button onClick={fetchServices} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Our Services</h1>
        <p className="services-subtitle">
          Explore our professional services and book your appointment easily.
        </p>
      </div>

      {services.length > 0 ? (
        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="no-services-container">
          <div className="no-services-icon">📋</div>
          <h3>No Services Available</h3>
          <p>We're currently updating our services. Please check back soon!</p>
        </div>
      )}
    </div>
  );
}
