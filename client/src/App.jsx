import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import authService from './services/authService';

// Components
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Footer from './components/Footer/Footer';

// Pages - Public
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';

import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Services from './pages/Services/Services';
import ServiceDetail from './pages/Services/ServiceDetail';
import BarberDashboard from './pages/Barber/BarberDashboard';
import BarberSchedule from './pages/Barber/BarberSchedule';
import BarberAppointments from './pages/Barber/BarberAppointments';
import CustomerBookings from './pages/Booking/MyBooking';
import Booking from './pages/Booking/Booking';
import NotFound from './pages/NotFound/NotFound';

// Pages - Admin
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminServices from './pages/Admin/AdminServices';
import AdminBarbers from './pages/Admin/AdminBarbers';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar user={user} setUser={setUser} />
      <main className="main-content">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home user={user} />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" replace /> : <Login setUser={setUser} />
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <Register setUser={setUser} />
              )
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* AUTHENTICATED USER ROUTES */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user} requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute user={user} requiredRole="admin">
                <AdminServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/barbers"
            element={
              <ProtectedRoute user={user} requiredRole="admin">
                <AdminBarbers />
              </ProtectedRoute>
            }
          />

          {/* BARBER ROUTES */}
          <Route
            path="/barber/dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={['barber']}>
                <BarberDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/barber/schedule"
            element={
              <ProtectedRoute user={user} allowedRoles={['barber']}>
                <BarberSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/barber/appointments"
            element={
              <ProtectedRoute user={user} allowedRoles={['barber']}>
                <BarberAppointments />
              </ProtectedRoute>
            }
          />

          {/* CUSTOMER ROUTES */}
          <Route
            path="/booking"
            element={
              <ProtectedRoute user={user} allowedRoles={['customer']}>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:serviceId"
            element={
              <ProtectedRoute user={user} allowedRoles={['customer']}>
                <Booking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute user={user} allowedRoles={['customer']}>
                <CustomerBookings />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
