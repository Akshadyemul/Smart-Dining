import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingBag,
  ArrowLeft,
  Clock,
  ChefHat,
  Package,
  CheckCircle,
  CreditCard,
  XCircle,
  Filter
} from 'lucide-react';
import { dataStore } from '@/services/dataStore';
import type { Order } from '@/types';
import { toast } from 'sonner';
export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');
  useEffect(() => {
    const fetchOrders = async () => {
      const data = await dataStore.getOrders();
      setOrders(data.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    };
    fetchOrders();
  }, []);
  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);
  const updateOrderStatus = async (order: Order, status: Order['status']) => {
    order.status = status;
    order.updatedAt = new Date().toISOString();
    await dataStore.updateOrder(order);
    const data = await dataStore.getOrders();
    setOrders(data.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    toast.success(`Order status updated to ${status}`);
  };
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
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
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
  const statusFilters = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { value: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { value: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
    { value: 'served', label: 'Served', count: orders.filter(o => o.status === 'served').length },
    { value: 'paid', label: 'Paid', count: orders.filter(o => o.status === 'paid').length },
  ];
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-1">Track and manage customer orders</p>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{orders.filter(o => o.status === 'preparing').length}</p>
              <p className="text-sm text-gray-600">Preparing</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </CardContent>
          </Card>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          {statusFilters.map(status => (
            <button
              key={status.value}
              onClick={() => setFilter(status.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === status.value
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {status.label} ({status.count})
            </button>
          ))}
        </div>
        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(order.status)}
                      <span className="font-semibold">Order #{order.id.slice(-6).toUpperCase()}</span>
                      {getStatusBadge(order.status)}
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Table</p>
                        <p className="font-medium">{order.tableNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Items</p>
                        <p className="font-medium">{order.items.reduce((sum, i) => sum + i.quantity, 0)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Time</p>
                        <p className="font-medium">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-bold text-orange-500">${order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                    </div>
                  </div>
                  {/* Status Actions */}
                  <div className="flex flex-wrap gap-2">
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order, 'preparing')}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <ChefHat className="mr-2 h-4 w-4" />
                        Start Preparing
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order, 'ready')}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Mark Ready
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order, 'served')}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Served
                      </Button>
                    )}
                    {(order.status === 'pending' || order.status === 'preparing') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus(order, 'cancelled')}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
