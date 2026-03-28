import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar as CalendarIcon,
  ArrowLeft,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  Filter,
  CalendarX,
  Loader2
} from 'lucide-react';
import { dataStore } from '@/services/dataStore';
import type { Reservation, Table, User } from '@/types';
import { toast } from 'sonner';
import { useRef } from 'react';

export default function AdminReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [userCache, setUserCache] = useState<Record<string, User>>({});
  const prevCountRef = useRef<number>(-1);

  useEffect(() => {
    let isInitialLoad = true;
    const fetchData = async () => {
      if (isInitialLoad) setIsLoading(true);
      const [resData, tableData] = await Promise.all([
        dataStore.getReservations(),
        dataStore.getTables()
      ]);
      const sortedData = resData.sort((a, b) =>
        new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime()
      );
      
      if (prevCountRef.current !== -1 && sortedData.length > prevCountRef.current) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.warn('Audio play blocked by browser:', e));
        toast.success('📅 New Reservation Received!', {
          style: { backgroundColor: '#8b5cf6', color: 'white', border: 'none' }
        });
      }
      prevCountRef.current = sortedData.length;
      setReservations(sortedData);
      setTables(tableData);

      // Fetch missing user details
      const userIdsToFetch = [...new Set(resData.filter(r => !r.userName && r.userId).map(r => r.userId))];
      if (userIdsToFetch.length > 0) {
        const newCache: Record<string, User> = {};
        await Promise.all(userIdsToFetch.map(async id => {
          const u = await dataStore.getNormalUserById(id);
          if (u) newCache[id] = u;
        }));
        setUserCache(prev => ({ ...prev, ...newCache }));
      }

      if (isInitialLoad) {
        setIsLoading(false);
        isInitialLoad = false;
      }
    };
    
    fetchData(); // Initial run

    const interval = setInterval(() => {
      fetchData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getTableNumber = (tableId: string) => {
    return tables.find(t => t.id === tableId)?.tableNumber || 'N/A';
  };

  const filteredReservations = filter === 'all'
    ? reservations
    : reservations.filter(r => r.status === filter);

  const updateReservationStatus = async (reservation: Reservation, status: Reservation['status']) => {
    try {
      reservation.status = status;
      await dataStore.updateReservation(reservation);
      const data = await dataStore.getReservations();
      setReservations(data.sort((a, b) =>
        new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime()
      ));
      toast.success(`Reservation status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update reservation status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-gray-600">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const statusFilters = [
    { value: 'all', label: 'All', count: reservations.length },
    { value: 'pending', label: 'Pending', count: reservations.filter(r => r.status === 'pending').length },
    { value: 'confirmed', label: 'Confirmed', count: reservations.filter(r => r.status === 'confirmed').length },
    { value: 'completed', label: 'Completed', count: reservations.filter(r => r.status === 'completed').length },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
            <p className="text-gray-600 mt-1">Manage customer table bookings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Filter className="h-5 w-5 text-gray-500 mr-2 mt-2" />
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

        {/* Reservations List */}
        <div className="space-y-4">
          {filteredReservations.map(reservation => (
            <Card key={reservation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <CalendarIcon className="h-5 w-5 text-purple-500" />
                      <span className="font-semibold">Res #{reservation.id.slice(-6).toUpperCase()}</span>
                      {getStatusBadge(reservation.status)}
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-900">{reservation.userName || userCache[reservation.userId]?.name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">{reservation.userPhone || userCache[reservation.userId]?.phone || 'No Phone Number'}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Table
                        </p>
                        <p className="font-medium mt-1">Table {getTableNumber(reservation.tableId)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          Guests
                        </p>
                        <p className="font-medium mt-1">{reservation.guests}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Date
                        </p>
                        <p className="font-medium mt-1">
                          {new Date(reservation.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Time
                        </p>
                        <p className="font-medium mt-1">{reservation.time}</p>
                      </div>
                    </div>
                    
                    {reservation.specialRequests && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium">Special Requests:</p>
                        <p className="text-sm mt-1">{reservation.specialRequests}</p>
                      </div>
                    )}
                  </div>

                  {/* Status Actions */}
                  <div className="flex flex-wrap gap-2">
                    {reservation.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateReservationStatus(reservation, 'confirmed')}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReservationStatus(reservation, 'cancelled')}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    {reservation.status === 'confirmed' && (
                      <Button
                        size="sm"
                        onClick={() => updateReservationStatus(reservation, 'completed')}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <CalendarX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No reservations found</p>
          </div>
        )}
      </div>
    </div>
  );
}