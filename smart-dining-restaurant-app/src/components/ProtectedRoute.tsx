import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
interface ProtectedRouteProps {
  children: React.ReactNode;
}
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, hasRestaurant, isLoading, restaurantStatusResolved } = useAuth();
  const location = useLocation();
  if (isLoading || (isAuthenticated && !restaurantStatusResolved)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // If user is authenticated but doesn't have a restaurant
  if (!hasRestaurant) {
    // Allow access to register-restaurant page only
    if (location.pathname === '/register-restaurant') {
      return <>{children}</>;
    }
    // For any other route, redirect to register-restaurant
    return <Navigate to="/register-restaurant" replace />;
  }
  // If user has a restaurant, prevent access to register-restaurant
  if (hasRestaurant && location.pathname === '/register-restaurant') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
