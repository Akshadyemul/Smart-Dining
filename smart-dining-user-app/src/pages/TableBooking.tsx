import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { dataStore } from '@/services/dataStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Check,
  Loader2,
  Info,
  ChevronRight,
  Store
} from 'lucide-react';
import type { Table, Reservation, RestaurantProfile } from '@/types';
import { toast } from 'sonner';

export default function TableBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const routeLocation = useLocation();

  const [restaurants, setRestaurants] = useState<RestaurantProfile[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(routeLocation.state?.restaurantId || '');
  const [tables, setTables] = useState<Table[]>([]);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const resData = await dataStore.getRestaurants();
      setRestaurants(resData);

      if (selectedRestaurantId) {
        const tableData = await dataStore.getTablesByRestaurant(selectedRestaurantId);
        setTables(tableData);
      }
      setIsLoading(false);
    };
    fetchInitialData();
  }, [selectedRestaurantId]);

  const handleRestaurantSelect = async (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setIsLoading(true);
    const tableData = await dataStore.getTablesByRestaurant(restaurantId);
    setTables(tableData);
    setSelectedTable(null);
    setIsLoading(false);
  };

  // Get available tables based on guests
  const availableTables = tables.filter(table =>
    table.capacity >= guests &&
    (table.status === 'available' || table.status === 'reserved')
  );

  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !selectedTable || !selectedRestaurantId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    const reservation: Partial<Reservation> = {
      id: `res-${Date.now()}`,
      userId: user!.id,
      restaurantId: selectedRestaurantId,
      tableId: selectedTable.id,
      tableNumber: selectedTable.tableNumber,
      date: selectedDate,
      time: selectedTime,
      guests,
      status: 'confirmed',
      specialRequests: specialRequests || undefined,
    };

    const savedReservation = await dataStore.addReservation(reservation);

    if (savedReservation) {
      toast.success('Table reserved successfully!');
      setShowConfirmation(true);
    } else {
      toast.error('Failed to reserve table. Please try again.');
    }

    setIsSubmitting(false);
  };

  if (isLoading && restaurants.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Reservation Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Your table has been reserved successfully.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="mb-2"><strong>Restaurant:</strong> {restaurants.find(r => r.id === selectedRestaurantId)?.name}</p>
                <p className="mb-2"><strong>Date:</strong> {selectedDate}</p>
                <p className="mb-2"><strong>Time:</strong> {selectedTime}</p>
                <p className="mb-2"><strong>Table:</strong> Table {selectedTable?.tableNumber}</p>
                <p className="mb-2"><strong>Guests:</strong> {guests}</p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/reservations')}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  View My Reservations
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Book a Table
          </h1>
          <p className="text-lg text-gray-600">
            Reserve your table for a delightful dining experience
          </p>
        </div>

        {!selectedRestaurantId ? (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Store className="mr-2 text-orange-500" /> Select a Restaurant
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {restaurants.map(res => (
                <Card
                  key={res.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-none"
                  onClick={() => handleRestaurantSelect(res.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={res.image || 'https://via.placeholder.com/60'} alt={res.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div>
                        <h3 className="font-bold">{res.name}</h3>
                        <p className="text-sm text-gray-500">{res.cuisineType}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <Store className="text-orange-500" />
                  <div>
                    <span className="text-sm text-gray-500">Booking for:</span>
                    <p className="font-bold">{restaurants.find(r => r.id === selectedRestaurantId)?.name}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRestaurantId('')}>Change</Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Reservation Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Date */}
                      <div className="space-y-2">
                        <Label htmlFor="date">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          Date *
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      {/* Time */}
                      <div className="space-y-2">
                        <Label htmlFor="time">
                          <Clock className="inline h-4 w-4 mr-1" />
                          Time *
                        </Label>
                        <select
                          id="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          required
                        >
                          <option value="">Select time</option>
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Guests */}
                    <div className="space-y-2">
                      <Label htmlFor="guests">
                        <Users className="inline h-4 w-4 mr-1" />
                        Number of Guests *
                      </Label>
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="text-xl font-medium w-8 text-center">{guests}</span>
                        <button
                          type="button"
                          onClick={() => setGuests(Math.min(12, guests + 1))}
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Table Selection */}
                    <div className="space-y-2">
                      <Label>
                        <MapPin className="inline h-4 w-4 mr-1" />
                        Select Table *
                      </Label>

                      {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                        </div>
                      ) : selectedDate && selectedTime ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {availableTables.map(table => (
                            <button
                              key={table.id}
                              type="button"
                              onClick={() => handleTableSelect(table)}
                              className={`p-4 rounded-lg border-2 text-left transition-all ${selectedTable?.id === table.id
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-orange-300'
                                }`}
                            >
                              <div className="font-semibold">Table {table.tableNumber}</div>
                              <div className="text-sm text-gray-600">
                                <Users className="inline h-3 w-3 mr-1" />
                                {table.capacity} seats
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{table.location}</div>
                            </button>
                          ))}
                          {availableTables.length === 0 && (
                            <div className="col-span-full py-8 text-center bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-500">No tables available for this requirement.</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Please select a date and time to see available tables
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Special Requests */}
                    <div className="space-y-2">
                      <Label htmlFor="requests">Special Requests (Optional)</Label>
                      <textarea
                        id="requests"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Any dietary requirements, special occasions, etc."
                        className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !selectedTable}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        'Confirm Reservation'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Info Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Opening Hours</p>
                      <p className="text-sm text-gray-600">Mon-Sun: 11:00 AM - 10:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Group Bookings</p>
                      <p className="text-sm text-gray-600">For groups larger than 12, please contact us</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Cancellation</p>
                      <p className="text-sm text-gray-600">Free cancellation up to 2 hours before</p>
                    </div>
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
