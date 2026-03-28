import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataStore } from '@/services/dataStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  ArrowRight,
  CalendarX,
  Loader2,
  Utensils
} from 'lucide-react';
import type { Reservation } from '@/types';
import { toast } from 'sonner';

export default function Reservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      const userReservations = await dataStore.getReservationsByUser();
      setReservations(userReservations.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
      setIsLoading(false);
    };
    fetchReservations();
  }, []);

  const handleCancel = async (reservation: Reservation) => {
    setCancellingId(reservation.id);

    try {
      await dataStore.updateReservation({ ...reservation, status: 'cancelled' });
      setReservations(prev =>
        prev.map(r => r.id === reservation.id ? { ...r, status: 'cancelled' } : r)
      );
      toast.success('Reservation cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel reservation');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-gray-600">Completed</Badge>;
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

  if (reservations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <CalendarX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Reservations Yet</h2>
            <p className="text-gray-600 mb-6">Book a table to enjoy our delicious food</p>
            <Button onClick={() => navigate('/book-table')} className="bg-orange-500 hover:bg-orange-600">
              Book a Table
              <ArrowRight className="ml-2 h-4 w-4" />
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
            <h1 className="text-3xl font-bold text-gray-900">My Reservations</h1>
            <p className="text-gray-600 mt-1">Manage your table bookings</p>
          </div>
          <Button onClick={() => navigate('/book-table')} className="bg-orange-500 hover:bg-orange-600">
            <Calendar className="mr-2 h-4 w-4" />
            Book New Table
          </Button>
        </div>

        <div className="space-y-4">
          {reservations.map(reservation => {
            const isUpcoming = new Date(reservation.date) >= new Date() &&
              reservation.status !== 'cancelled' &&
              reservation.status !== 'completed';

            return (
              <Card key={reservation.id} className={isUpcoming ? 'border-orange-200' : ''}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(reservation.status)}
                        {isUpcoming && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Upcoming
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Date
                          </p>
                          <p className="font-medium">{reservation.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Time
                          </p>
                          <p className="font-medium">{reservation.time}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            Guests
                          </p>
                          <p className="font-medium">{reservation.guests}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            Table
                          </p>
                          <p className="font-medium">
                            Table {reservation.tableNumber || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {reservation.specialRequests && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">Special Requests:</p>
                          <p className="text-sm">{reservation.specialRequests}</p>
                        </div>
                      )}
                    </div>

                    {isUpcoming && (
                      <div className="flex md:flex-col gap-2">
                        {reservation.status === 'confirmed' && (
                          <Button 
                            className="bg-orange-500 hover:bg-orange-600 flex-1 md:flex-none"
                            onClick={() => navigate(reservation.tableId ? `/qr-order/${reservation.tableId}` : '/menu')}
                          >
                            <Utensils className="mr-2 h-4 w-4" />
                            Pre-Order Food
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(reservation)}
                          disabled={cancellingId === reservation.id}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          {cancellingId === reservation.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            'Cancel'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
