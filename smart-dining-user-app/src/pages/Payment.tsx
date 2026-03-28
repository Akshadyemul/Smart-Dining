import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataStore } from '@/services/dataStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Banknote,
  Check,
  MapPin,
  QrCode,
  Loader2,
  ArrowLeft
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
                <p className="mb-2"><strong>Amount Paid:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                <p className="mb-2"><strong>Payment Method:</strong> {paymentMethod === 'online' ? 'UPI QR Payment' : 'Pay at Counter'}</p>
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
                        <QrCode className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">UPI QR Payment</p>
                        <p className="text-sm text-gray-600">Scan QR to pay with any UPI app</p>
                      </div>
                    </Label>
                  </div>

                  <div className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}>
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center cursor-pointer flex-1">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                        <Banknote className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-orange-600">Pay at Counter</p>
                        <p className="text-sm text-gray-700">Food will <span className="font-bold">NOT</span> be prepared until you check-in at the restaurant.</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'online' && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                    <p className="font-medium mb-4 text-gray-800">Scan to Pay ₹{total.toFixed(2)}</p>
                    <div className="bg-white p-4 inline-block rounded-xl border-2 border-dashed border-gray-200 mb-4">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=restaurant@upi&pn=SmartDining&am=${total.toFixed(2)}`} 
                        alt="UPI QR Code" 
                        className="w-48 h-48 mx-auto" 
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      Open Google Pay, PhonePe, or Paytm and scan this QR code
                    </p>
                    <p className="text-xs text-gray-400 mt-4">
                      * This is a demo QR code. Processing bypasses real payment gateways.
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
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">₹{total.toFixed(2)}</span>
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
                      {paymentMethod === 'online' ? <QrCode className="mr-2 h-4 w-4" /> : <Banknote className="mr-2 h-4 w-4" />}
                      Complete Order
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
