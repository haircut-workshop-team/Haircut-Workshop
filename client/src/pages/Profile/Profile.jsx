import { useState } from "react";
import PropTypes from "prop-types";
import api from "../../services/api";
import { checkPasswordStrength } from "../../utils/PasswordStrength";
import { formatDate } from "../../utils/formatters";
import PasswordStrength from "../../components/PasswordStrength/PasswordStrength";
import AvatarUpload from "../../components/AvatarUpload/AvatarUpload";
import "./Profile.css";

function Profile({ user, setUser }) {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [newPasswordStrength, setNewPasswordStrength] = useState({
    strength: 0,
    label: "",
    color: "",
    checks: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  // handlePasswordChange for password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData({
      ...passwordData,
      [name]: value,
    });

    // Check password strength for new password
    if (name === "newPassword") {
      const result = checkPasswordStrength(value);
      setNewPasswordStrength(result);
    }
  };

  // handleUpdateProfile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.request(`/users/${user.id}`, {
        method: "PUT",
        body: profileData,
      });

      setUser(response.data);
      setMessage("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // handleChangePassword for password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.request("/users/password/change", {
        method: "PUT",
        body: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
      });

      setMessage("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setNewPasswordStrength({
        strength: 0,
        label: "",
        color: "",
        checks: null,
      });
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // handleAvatarUpload
  const handleAvatarUpload = (newAvatarUrl) => {
    setUser({ ...user, profile_image: newAvatarUrl });
    setMessage("Avatar updated successfully!");
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>My Profile</h2>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Profile Information */}
        <section className="profile-section">
          <h3>Profile Information</h3>

          <AvatarUpload
            currentAvatar={user?.profile_image}
            onUploadSuccess={handleAvatarUpload}
          />

          <div className="profile-info">
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Role:</strong> {user?.role}
            </p>
            <p>
              <strong>Member since:</strong> {formatDate(user?.created_at)}
            </p>
          </div>

          {!editMode ? (
            <div className="profile-info">
              <p>
                <strong>Name:</strong> {user?.name}
              </p>
              <p>
                <strong>Phone:</strong> {user?.phone || "Not provided"}
              </p>
              <button
                onClick={() => setEditMode(true)}
                className="btn btn-secondary"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="profile-name">Name</label>
                <input
                  type="text"
                  id="profile-name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  autoComplete="name"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-phone">Phone</label>
                <input
                  type="tel"
                  id="profile-phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  autoComplete="tel"
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Change Password */}
        <section className="profile-section">
          <h3>Change Password</h3>

          <form onSubmit={handleChangePassword} className="profile-form">
            <div className="form-group">
              <label htmlFor="current-password">Current Password</label>
              <input
                type="password"
                id="current-password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                autoComplete="current-password"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <input
                type="password"
                id="new-password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                autoComplete="new-password"
                disabled={loading}
                required
              />
            </div>

            <PasswordStrength
              password={passwordData.newPassword}
              strength={newPasswordStrength.strength}
              label={newPasswordStrength.label}
              color={newPasswordStrength.color}
              checks={newPasswordStrength.checks}
            />

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm New Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                autoComplete="new-password"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    role: PropTypes.string.isRequired,
    profile_image: PropTypes.string,
    created_at: PropTypes.string,
  }),
  setUser: PropTypes.func.isRequired,
};

export default Profile;
