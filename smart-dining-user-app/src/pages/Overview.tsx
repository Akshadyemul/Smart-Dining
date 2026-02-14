import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { dataStore } from '@/services/dataStore';
import type { Reservation, Order } from '@/types';
import {
  Utensils,
  QrCode,
  Calendar,
  Clock,
  LayoutDashboard,
  ChefHat,
  ArrowRight,
  Star,
  Users,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Overview() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          const [resData, orderData] = await Promise.all([
            dataStore.getReservationsByUser(),
            dataStore.getOrdersByUser()
          ]);
          setReservations(resData.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 3));
          setOrders(orderData.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 3));
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white py-20 lg:py-32">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"
              alt="Restaurant"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Experience Smart Dining</h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">Book tables, order food, and track your dining experience.</p>
            <div className="flex justify-center gap-4">
              <Link to="/login"><Button size="lg" className="bg-white text-orange-600">Get Started</Button></Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <Calendar className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
              <p className="text-gray-600">Reserve your favorite spot in seconds.</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <QrCode className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">QR Ordering</h3>
              <p className="text-gray-600">Scan and order without waiting.</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Live Tracking</h3>
              <p className="text-gray-600">Know exactly when your food is ready.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <LayoutDashboard className="h-8 w-8 text-[#fc8019]" />
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-500">Here's what's happening with your dining today.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/')}>Find Restaurants</Button>
            <Button className="bg-[#fc8019] hover:bg-orange-600" onClick={() => navigate('/book-table')}>Book a Table</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Reservations */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-bold">Recent Reservations</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/reservations')} className="text-orange-500">
                    See All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reservations.length > 0 ? (
                      reservations.map((res) => (
                        <div key={res.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-bold">Table {res.tableNumber}</p>
                              <p className="text-sm text-gray-500">{res.date} • {res.time}</p>
                            </div>
                          </div>
                          <Badge className={res.status === 'confirmed' ? 'bg-green-500' : 'bg-gray-500'}>
                            {res.status.toUpperCase()}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-xl">
                        No upcoming reservations.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/my-orders')} className="text-orange-500">
                    See All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <Utensils className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-bold">Order #{order.id.slice(-4).toUpperCase()}</p>
                              <p className="text-sm text-gray-500">{order.items.length} items • ${order.totalAmount.toFixed(2)}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-blue-500 text-blue-500">
                            {order.status.toUpperCase()}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-xl">
                        No recent orders.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <Card className="bg-[#fc8019] text-white border-none shadow-xl overflow-hidden relative">
                <div className="absolute -right-8 -bottom-8 opacity-20">
                  <ChefHat className="h-40 w-40" />
                </div>
                <CardContent className="p-6 relative">
                  <h3 className="text-2xl font-bold mb-2">Smart Loyalty</h3>
                  <p className="text-orange-100 mb-6 font-medium">You have 250 points! Redeem them for exclusive discounts.</p>
                  <Button className="bg-white text-orange-600 hover:bg-gray-100 w-full font-bold">View Rewards</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100">
                    {[
                      { icon: <QrCode className="h-5 w-5" />, label: 'Scan QR to Order', path: '/menu' },
                      { icon: <Star className="h-5 w-5" />, label: 'Rate Last Experience', path: '/' },
                      { icon: <Users className="h-5 w-5" />, label: 'Invite Friends', path: '/' },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => navigate(item.path)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-orange-500">{item.icon}</div>
                          <span className="font-medium text-gray-700">{item.label}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
