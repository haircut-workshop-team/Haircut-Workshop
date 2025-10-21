import { Navigate } from "react-router-dom";
import "./ProtectedRoutes.css";

export default function ProtectedRoutes({ user, requiredRole, children }) {
  // check if user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
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
