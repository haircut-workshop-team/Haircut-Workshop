import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "./services/authService";

// Components
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";

// Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile/Profile";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check if the user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error("Auth check failed", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  return (
    <div className="app">
      <Navbar user={user} setUser={setUser} />
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/" /> : <Register setUser={setUser} />
            }
          />
          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoutes user={user}>
                <Profile user={user} setUser={setUser} />
              </ProtectedRoutes>
            }
          />
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
