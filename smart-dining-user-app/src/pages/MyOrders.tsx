import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataStore } from '@/services/dataStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingBag,
  Clock,
  MapPin,
  ChevronRight,
  Package,
  ChefHat,
  CheckCircle,
  CreditCard,
  Loader2
} from 'lucide-react';
import type { Order } from '@/types';
import { toast } from 'sonner';

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isInitialLoad = true;
    let prevOrdersRef: Order[] = [];

    const fetchOrders = async () => {
      if (isInitialLoad) setIsLoading(true);
      const userOrders = await dataStore.getOrdersByUser();
      const sortedOrders = userOrders.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      if (!isInitialLoad) {
        sortedOrders.forEach(newOrder => {
          const oldOrder = prevOrdersRef.find(o => o.id === newOrder.id);
          if (oldOrder && oldOrder.status !== newOrder.status) {
            if (newOrder.status === 'ready' || newOrder.status === 'served') {
               toast.success(`🍽️ Order #${newOrder.id.slice(-6).toUpperCase()} is now ${newOrder.status.toUpperCase()}!`, {
                 style: { backgroundColor: '#22c55e', color: 'white', border: 'none' },
                 duration: 6000
               });
            } else {
               toast.info(`Order #${newOrder.id.slice(-6).toUpperCase()} status updated to ${newOrder.status}`);
            }
          }
        });
      }

      setOrders(sortedOrders);
      prevOrdersRef = sortedOrders;
      
      if (isInitialLoad) {
        setIsLoading(false);
        isInitialLoad = false;
      }
    };

    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'preparing':
        return <ChefHat className="h-5 w-5 text-orange-500" />;
      case 'ready':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'served':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'paid':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case 'preparing':
        return <Badge className="bg-orange-500">Preparing</Badge>;
      case 'ready':
        return <Badge className="bg-blue-500">Ready</Badge>;
      case 'served':
        return <Badge className="bg-green-500">Served</Badge>;
      case 'paid':
        return <Badge className="bg-purple-500">Paid</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Unpaid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">Start ordering delicious food from our menu</p>
            <Button onClick={() => navigate('/menu')} className="bg-orange-500 hover:bg-orange-600">
              Browse Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">Track and manage your orders</p>
          </div>
          <Button onClick={() => navigate('/menu')} className="bg-orange-500 hover:bg-orange-600">
            Order More
          </Button>
        </div>

        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-semibold">Order #{order.id.slice(-6).toUpperCase()}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()} at {' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(order.status)}
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  Table {order.tableNumber}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium mb-2">Items:</p>
                  <ul className="space-y-1">
                    {order.items.slice(0, 3).map((item, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {item.quantity} x {item.name}
                      </li>
                    ))}
                    {order.items.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{order.items.length - 3} more items
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-orange-500">
                      
₹{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {order.paymentStatus === 'pending' && order.status !== 'cancelled' && (
                      <Button
                        onClick={() => navigate(`/payment/${order.id}`)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Pay Now
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
