import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from '@/components/ui/sonner';

// Pages
import Home from '@/pages/Home';
import Login from '@/auth/Login';
import Register from '@/auth/Register';
import Menu from '@/pages/Menu';
import Cart from '@/pages/Cart';
import Reservations from '@/pages/Reservations';
import MyOrders from '@/pages/MyOrders';
import TableBooking from '@/pages/TableBooking';
import QROrdering from '@/pages/QROrdering';
import Payment from '@/pages/Payment';
import OrderSuccess from '@/pages/OrderSuccess';
import Overview from '@/pages/Overview';
import RestaurantDetail from '@/pages/RestaurantDetail';


// Components
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/restaurant/:id" element={<ProtectedRoute> <RestaurantDetail /> </ProtectedRoute>} />

                {/* Protected Customer Routes */}
                <Route path="/menu" element={<ProtectedRoute> <Menu /> </ProtectedRoute>} />
                <Route path="/qr-order/:tableId" element={<ProtectedRoute> <QROrdering /> </ProtectedRoute>} />

                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
                <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                <Route path="/book-table" element={<ProtectedRoute><TableBooking /></ProtectedRoute>} />
                <Route path="/payment/:orderId" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />



                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </Router>
      </CartProvider>

    </AuthProvider>
  );
}

export default App;
