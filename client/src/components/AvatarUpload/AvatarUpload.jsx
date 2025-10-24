import { useState } from "react";
import api, { SERVER_URL } from "../../services/api";
import "./AvatarUpload.css";

function AvatarUpload({ currentAvatar, onUploadSuccess }) {
  const [preview, setPreview] = useState(currentAvatar || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
    reader.readAsDataURL(file);

    // Upload to server
    await uploadAvatar(file);
  };

  const uploadAvatar = async (file) => {
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.request("/users/avatar", {
        method: "POST",
        body: formData,
      });

      // Call parent callback with new avatar URL
      if (onUploadSuccess) {
        onUploadSuccess(response.data.profile_image);
      }
    } catch (err) {
      setError(err.message || "Failed to upload avatar");
      setPreview(currentAvatar);
    } finally {
      setUploading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    // If it's a blob or data URL (preview), return as is
    if (url.startsWith("blob:") || url.startsWith("data:")) {
      return url;
    }
    // Otherwise, prepend server URL
    return `${SERVER_URL}${url}`;
  };

  return (
    <div className="avatar-upload-container">
      <div className="avatar-preview">
        {preview ? (
          <img src={getImageUrl(preview)} alt="Avatar preview" />
        ) : (
          <div className="avatar-placeholder">
            <span>👤</span>
          </div>
        )}
        {uploading && (
          <div className="upload-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      <div className="avatar-actions">
        <label htmlFor="avatar-input" className="btn btn-secondary">
          {preview ? "Change Photo" : "Upload Photo"}
        </label>
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {error && <p className="avatar-error">{error}</p>}
      {uploading && <p className="avatar-uploading">Uploading...</p>}
    </div>
  );
}

export default AvatarUpload;
