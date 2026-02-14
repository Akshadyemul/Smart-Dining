import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';

// Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import RegisterRestaurant from '@/pages/auth/RegisterRestaurant';

// Admin Pages
import AdminDashboard from '@/pages/Dashboard';
import AdminTables from '@/pages/Tables';
import AdminMenu from '@/pages/Menu';
import AdminOrders from '@/pages/Orders';
import AdminReservations from '@/pages/Reservations';
import Profile from '@/pages/Profile';

// Components
import Navbar from '@/components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />


              {/* Admin Routes */}
              <Route path="/register-restaurant" element={<ProtectedRoute><RegisterRestaurant /></ProtectedRoute>} />
              <Route path="/" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/tables" element={<ProtectedRoute><AdminTables /></ProtectedRoute>} />
              <Route path="/menu" element={<ProtectedRoute><AdminMenu /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
              <Route path="/reservations" element={<ProtectedRoute><AdminReservations /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* Redirects */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
