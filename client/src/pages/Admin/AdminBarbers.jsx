import { useState, useEffect } from "react";
import barberService from "../../services/barberService";
import "./AdminBarbers.css";

function AdminBarbers() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBarber, setCurrentBarber] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialties: "",
    years_experience: "",
    bio: "",
  });

  // Load barbers on mount
  useEffect(() => {
    loadBarbers();
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

  // Load all barbers
  const loadBarbers = async () => {
    try {
      setLoading(true);
      const data = await barberService.getAllBarbers();
      setBarbers(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load barbers");
      console.error("Load barbers error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for adding new barber
  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentBarber(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      specialties: "",
      years_experience: "",
      bio: "",
    });
    setShowModal(true);
  };

  // Open modal for editing barber
  const handleEditClick = (barber) => {
    setIsEditing(true);
    setCurrentBarber(barber);
    setFormData({
      name: barber.name,
      email: barber.email,
      password: "",
      phone: barber.phone || "",
      specialties: barber.specialties || "",
      years_experience: barber.years_experience || "",
      bio: barber.bio || "",
    });
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentBarber(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      specialties: "",
      years_experience: "",
      bio: "",
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isEditing && currentBarber) {
        await barberService.updateBarber(currentBarber.id, formData);
        setSuccess("Barber updated successfully!");
      } else {
        await barberService.createBarber(formData);
        setSuccess("Barber created successfully!");
      }

      handleCloseModal();
      loadBarbers();
    } catch (err) {
      setError(err.message || "Operation failed");
      console.error("Submit error:", err);
    }
  };

  // Handle delete barber
  const handleDelete = async (barber) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${barber.name}"?\n\nThis will convert their account to a customer role.`
    );

    if (!confirmed) return;

    try {
      await barberService.deleteBarber(barber.id);
      setSuccess(`Barber "${barber.name}" deleted successfully!`);
      loadBarbers();
    } catch (err) {
      setError(err.message || "Failed to delete barber");
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="admin-barbers-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading barbers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-barbers-page">
      <div className="admin-barbers-container">
        {/* Header */}
        <div className="admin-barbers-header">
          <div>
            <h2>Manage Barbers</h2>
            <p className="subtitle">Add, edit, or remove barbers</p>
          </div>
          <button onClick={handleAddClick} className="btn">
            + Add New Barber
          </button>
        </div>

        {/* Alerts */}
        {success && (
          <div className="alert alert-success">
            <span>✓</span>
            {success}
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <span>✕</span>
            {error}
          </div>
        )}

        {/* Barbers Table */}
        <div className="barbers-content">
          {barbers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✂️</div>
              <h3>No Barbers Yet</h3>
              <p>Start by adding your first barber</p>
              <button onClick={handleAddClick} className="btn btn-primary">
                Add First Barber
              </button>
            </div>
          ) : (
            <table className="barbers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Specialties</th>
                  <th>Experience</th>
                  <th>Rating</th>
                  <th>Appointments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {barbers.map((barber) => (
                  <tr key={barber.id}>
                    <td>
                      <strong>{barber.name}</strong>
                    </td>
                    <td>{barber.email}</td>
                    <td>{barber.phone || "—"}</td>
                    <td>{barber.specialties || "—"}</td>
                    <td>
                      {barber.years_experience
                        ? `${barber.years_experience} years`
                        : "—"}
                    </td>
                    <td>
                      ⭐ {barber.rating ? barber.rating.toFixed(1) : "0.0"}
                      <span className="reviews-count">
                        ({barber.total_reviews} reviews)
                      </span>
                    </td>
                    <td>
                      {barber.total_appointments || 0}
                      <span className="completed-count">
                        ({barber.completed_appointments || 0} completed)
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => handleEditClick(barber)}
                        className="btn-action btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(barber)}
                        className="btn-action btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditing ? "Edit Barber" : "Add New Barber"}</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isEditing}
                />
              </div>

              {!isEditing && (
                <div className="form-group">
                  <label>
                    Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!isEditing}
                    minLength="8"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Specialties</label>
                <input
                  type="text"
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleChange}
                  placeholder="e.g., Haircuts, Beard Trimming"
                />
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="years_experience"
                  value={formData.years_experience}
                  onChange={handleChange}
                  min="0"
                  max="50"
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  maxLength="500"
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Update Barber" : "Create Barber"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBarbers;
