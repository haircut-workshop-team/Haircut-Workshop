import { Navigate, useLocation } from "react-router-dom";
import "./ProtectedRoute.css";

export default function ProtectedRoute({ user, requiredRole, children }) {
  const location = useLocation();

  // check if user is not logged in, redirect to login page
  // save current location to redirect back after login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if a specific role is required, check if the user has that role
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  // if all checks pass, render the protected route
  return children;
}
