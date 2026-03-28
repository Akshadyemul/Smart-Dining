import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataStore } from '@/services/dataStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Package,
  ChefHat,
  CheckCircle,
  CreditCard,
  XCircle,
  Loader2,
  Calendar
} from 'lucide-react';
import type { Order } from '@/types';

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        const data = await dataStore.getOrderById(orderId);
        setOrder(data);
      }
      setIsLoading(false);
    };
    fetchOrder();

    const interval = setInterval(() => {
      fetchOrder();
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'preparing': return <ChefHat className="h-6 w-6 text-orange-500" />;
      case 'ready': return <Package className="h-6 w-6 text-blue-500" />;
      case 'served': return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'paid': return <CreditCard className="h-6 w-6 text-purple-500" />;
      case 'cancelled': return <XCircle className="h-6 w-6 text-red-500" />;
      default: return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-sm">Pending</Badge>;
      case 'preparing': return <Badge className="bg-orange-500 text-sm">Preparing</Badge>;
      case 'ready': return <Badge className="bg-blue-500 text-sm">Ready</Badge>;
      case 'served': return <Badge className="bg-green-500 text-sm">Served</Badge>;
      case 'paid': return <Badge className="bg-purple-500 text-sm">Paid</Badge>;
      case 'cancelled': return <Badge variant="secondary" className="text-sm">Cancelled</Badge>;
      default: return <Badge variant="outline" className="text-sm">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
        <div>
          <p className="text-gray-600 mb-4 text-lg">Order not found</p>
          <Button onClick={() => navigate('/my-orders')} className="bg-orange-500 hover:bg-orange-600">
            Back to My Orders
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = order.totalAmount;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/my-orders')} className="mr-4 pl-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">Order Details</h1>
          </div>
          {order.paymentStatus === 'pending' && order.status !== 'cancelled' && (
            <Button onClick={() => navigate(`/payment/${order.id}`)} className="bg-orange-500 hover:bg-orange-600 font-bold">
              Pay ₹{total.toFixed(2)}
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Order Status Banner */}
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg capitalize">{order.status}</span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 pl-0 md:pl-6 w-full md:w-auto">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order #</p>
                  <p className="font-mono text-gray-900">{order.id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">Table {order.tableNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()} at {' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Payment Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-500">Method</p>
                  <p className="font-medium capitalize">{order.paymentMethod === 'online' ? 'UPI QR' : 'Pay at Counter'}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-500">Payment Status</p>
                  <Badge variant={order.paymentStatus === 'completed' ? 'default' : 'outline'} className={order.paymentStatus === 'completed' ? 'bg-green-500 text-white' : 'text-yellow-600 border-yellow-600'}>
                    {order.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Itemized Receipt */}
          <Card>
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-lg">Itemized Receipt</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl text-orange-500">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
