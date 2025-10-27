import { useState, useEffect } from "react";
import serviceService from "../../services/serviceService";
import { truncateText } from "../../utils/formatters";
import "./AdminServices.css";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    image_url: "",
  });

  // Load services on mount
  useEffect(() => {
    loadServices();
  }, []);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Load all services
  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getAllServices();
      setServices(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load services");
      console.error("Load services error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for adding new service
  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentService(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      image_url: "",
    });
    setShowModal(true);
  };

  // Open modal for editing service
  const handleEditClick = (service) => {
    setIsEditing(true);
    setCurrentService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      image_url: service.image_url || "",
    });
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentService(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      image_url: "",
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isEditing && currentService) {
        // Update existing service
        await serviceService.updateService(currentService.id, formData);
        setSuccess("Service updated successfully!");
      } else {
        // Create new service
        await serviceService.createService(formData);
        setSuccess("Service created successfully!");
      }

      handleCloseModal();
      loadServices();
    } catch (err) {
      setError(err.message || "Operation failed");
      console.error("Submit error:", err);
    }
  };

  // Handle delete service
  const handleDelete = async (service) => {
    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await serviceService.deleteService(service.id);
      setSuccess(`Service "${service.name}" deleted successfully!`);
      loadServices();
    } catch (err) {
      setError(err.message || "Failed to delete service");
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="admin-services-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-services-page">
      <div className="admin-services-container">
        {/* Header */}
        <div className="admin-services-header">
          <div>
            <h2>Manage Services</h2>
            <p className="subtitle">Add, edit, or remove services</p>
          </div>
          <button onClick={handleAddClick} className="btn btn-primary">
            + Add New Service
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">❌</span>
            <span>{error}</span>
          </div>
        )}

        {/* Services Table */}
        {services.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Services Yet</h3>
            <p>Start by adding your first service</p>
            <button onClick={handleAddClick} className="btn btn-primary">
              Add First Service
            </button>
          </div>
        ) : (
          <div className="services-table-container">
            <table className="services-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>{service.id}</td>
                    <td className="service-image-cell">
                      {service.image_url ? (
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="service-image"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/60x60?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="no-image">📷</div>
                      )}
                    </td>

                    <td className="service-name">{service.name}</td>
                    <td className="service-description">
                      {truncateText(service.description, 60)}
                    </td>
                    <td className="service-price">${service.price}</td>
                    <td>{service.duration} min</td>
                    <td className="actions">
                      <button
                        onClick={() => handleEditClick(service)}
                        className="btn-icon btn-edit"
                        title="Edit service"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service)}
                        className="btn-icon btn-delete"
                        title="Delete service"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Service */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditing ? "Edit Service" : "Add New Service"}</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="service-form">
              <div className="form-group">
                <label htmlFor="name">
                  Service Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Classic Haircut"
                  required
                  minLength="3"
                  maxLength="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the service..."
                  required
                  minLength="10"
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">
                    Price ($) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="25.00"
                    required
                    min="0"
                    max="10000"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duration">
                    Duration (min) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="30"
                    required
                    min="1"
                    max="480"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="image_url">Image URL (Optional)</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Update Service" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminServices;
