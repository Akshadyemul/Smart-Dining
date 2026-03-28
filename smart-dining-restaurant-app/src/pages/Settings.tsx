import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Bell,
  Settings as SettingsIcon,
  Store,
  CreditCard,
  AlertTriangle,
  Save,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { user, hasRestaurant } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Mock Operational State
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  const [pauseNewOrders, setPauseNewOrders] = useState(false);

  // Mock Notifications State
  const [newOrderSound, setNewOrderSound] = useState(true);
  const [tableBookingAlerts, setTableBookingAlerts] = useState(true);

  // Mock Financial State
  const [taxRate, setTaxRate] = useState('5.0');
  const [payoutMethod, setPayoutMethod] = useState('bank_transfer');

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API Save
      toast.success('Restaurant settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivate = () => {
    toast.error('Restaurant deactivation requested. Please review your terms of service.');
  };

  if (!user || !hasRestaurant) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Store className="h-16 w-16 text-gray-300" />
        <p className="text-gray-600">You must have an active restaurant to view these settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-orange-500" />
            Restaurant Settings
          </h1>
          <p className="text-gray-600">Configure your operations, notifications, and financial details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Operations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-orange-500" />
                Operations
              </CardTitle>
              <CardDescription>Manage how your restaurant handles incoming requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Accept New Orders</Label>
                  <p className="text-sm text-gray-500">Automatically confirm orders when they arrive</p>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${autoAcceptOrders ? 'bg-orange-500' : 'bg-gray-200'}`}
                  onClick={() => setAutoAcceptOrders(!autoAcceptOrders)}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${autoAcceptOrders ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Pause All New Orders</Label>
                  <p className="text-sm text-gray-500">Temporarily stop receiving new online orders (Busy Mode)</p>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${pauseNewOrders ? 'bg-red-500' : 'bg-gray-200'}`}
                  onClick={() => setPauseNewOrders(!pauseNewOrders)}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${pauseNewOrders ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Alerts & Notifications
              </CardTitle>
              <CardDescription>Setup audio and dashboard alerts for staff</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Order Sound Alert</Label>
                  <p className="text-sm text-gray-500">Play a loud sound when a new order arrives</p>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${newOrderSound ? 'bg-orange-500' : 'bg-gray-200'}`}
                  onClick={() => setNewOrderSound(!newOrderSound)}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${newOrderSound ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Table Booking Notifications</Label>
                  <p className="text-sm text-gray-500">Alert staff for incoming reservation requests</p>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${tableBookingAlerts ? 'bg-orange-500' : 'bg-gray-200'}`}
                  onClick={() => setTableBookingAlerts(!tableBookingAlerts)}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${tableBookingAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </CardContent>
          </Card>

           {/* Financial */}
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-500" />
                Financial Settings
              </CardTitle>
              <CardDescription>Configure your global tax and payout methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Applied automatically to subtotal</p>
                </div>

                <div className="space-y-2">
                  <Label>Payout Method</Label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    <option value="bank_transfer">Direct Bank Transfer</option>
                    <option value="paypal">PayPal Business</option>
                    <option value="stripe">Stripe Connect</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pt-4 pb-8">
            <Button
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="bg-orange-500 hover:bg-orange-600 px-8"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save All Settings
            </Button>
          </div>

          {/* Danger Zone */}
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-red-700 font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-red-600/80">Critical actions that affect your restaurant's visibility</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-between">
                 <div className="space-y-1 text-red-900">
                   <p className="font-medium">Deactivate Restaurant</p>
                   <p className="text-sm text-red-700/80">Hide restaurant from customers and cancel pending orders</p>
                 </div>
                 <Button variant="destructive" onClick={handleDeactivate}>
                   Deactivate
                 </Button>
               </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
