import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ShoppingBag, Home, Utensils, Loader2 } from 'lucide-react';
import { dataStore } from '@/services/dataStore';
import type { Order } from '@/types';

export default function OrderSuccess() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        const data = await dataStore.getOrderById(orderId);
        if (data) {
          setOrder(data);
        } else {
          navigate('/my-orders');
        }
      }
      setIsLoading(false);
    };
    fetchOrder();
  }, [orderId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-500" />
            </div>

            <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
            <p className="text-gray-600 mb-6">
              Your order has been placed successfully. We'll start preparing it right away!
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium">#{order.id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Table</span>
                <span className="font-medium">{order.tableNumber}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Items</span>
                <span className="font-medium">{order.items.reduce((sum, i) => sum + i.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-orange-500">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/my-orders')}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Track My Order
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/menu')}
                className="w-full"
              >
                <Utensils className="mr-2 h-4 w-4" />
                Order More
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
