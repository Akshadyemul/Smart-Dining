import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataStore } from '@/services/dataStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  CreditCard,
  Banknote,
  Check,
  Loader2,
  ArrowLeft,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import type { Order } from '@/types';

export default function Payment() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">Order not found</p>
            <Button onClick={() => navigate('/my-orders')} className="bg-orange-500 hover:bg-orange-600">
              View My Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Update order in backend
      const updatedOrder = await dataStore.updateOrder({
        ...order,
        paymentStatus: 'completed',
        paymentMethod: paymentMethod,
        status: 'paid'
      });

      if (updatedOrder) {
        setOrder(updatedOrder);
        setIsSuccess(true);
        toast.success('Payment successful!');
      } else {
        toast.error('Payment update failed');
      }
    } catch (error) {
      toast.error('Error processing payment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your payment. Your order has been confirmed.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="mb-2"><strong>Order ID:</strong> #{order.id.slice(-6).toUpperCase()}</p>
                <p className="mb-2"><strong>Amount Paid:</strong> ${order.totalAmount.toFixed(2)}</p>
                <p className="mb-2"><strong>Payment Method:</strong> {paymentMethod === 'online' ? 'Online Payment' : 'Cash'}</p>
                <p><strong>Table:</strong> {order.tableNumber}</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/my-orders')}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  View My Orders
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const subtotal = order.totalAmount;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Payment</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as 'online' | 'cash')}
                  className="space-y-4"
                >
                  <div className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}>
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center cursor-pointer flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Online Payment</p>
                        <p className="text-sm text-gray-600">Pay securely with credit/debit card</p>
                      </div>
                    </Label>
                  </div>

                  <div className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}>
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center cursor-pointer flex-1">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <Banknote className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay with cash when your order arrives</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'online' && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-4">Card Details (Demo)</p>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-600">Card Number</Label>
                        <div className="p-3 bg-white border rounded-lg font-mono">
                          **** **** **** 4242
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">Expiry</Label>
                          <div className="p-3 bg-white border rounded-lg font-mono">
                            12/25
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">CVV</Label>
                          <div className="p-3 bg-white border rounded-lg font-mono">
                            ***
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      * This is a demo. No actual payment will be processed.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  Table {order.tableNumber}
                </div>

                <div className="max-h-40 overflow-y-auto space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity} x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">${total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay ${total.toFixed(2)}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
