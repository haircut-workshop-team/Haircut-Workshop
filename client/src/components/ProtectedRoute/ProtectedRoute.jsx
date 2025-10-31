import { Navigate, useLocation } from "react-router-dom";
import "./ProtectedRoute.css";

export default function ProtectedRoute({
  user,
  requiredRole,
  allowedRoles,
  children,
}) {
  const location = useLocation();

  // Check if user is not logged in, redirect to login page
  // Save current location to redirect back after login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if a SINGLE specific role is required
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  // Check if user has one of the ALLOWED roles (array)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  // If all checks pass, render the protected route
  return children;
}
