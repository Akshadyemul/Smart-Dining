import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataStore } from '@/services/dataStore';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import type { RestaurantProfile, MenuItem, Category, Table, Reservation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, ShoppingCart, Check, Star, Clock, MapPin, ArrowLeft, Loader2, Calendar, Users, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function RestaurantDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [restaurant, setRestaurant] = useState<RestaurantProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<Category>('all');
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
    const { addToCart } = useCart();

    // Booking state
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [guests, setGuests] = useState(2);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [availableTables, setAvailableTables] = useState<Table[]>([]);
    const [isBooking, setIsBooking] = useState(false);
    const [isFetchingTables, setIsFetchingTables] = useState(false);

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (id) {
                const data = await dataStore.getRestaurantDetail(id);
                setRestaurant(data);
            }
            setIsLoading(false);
        };
        fetchRestaurant();
    }, [id]);

    useEffect(() => {
        const fetchTables = async () => {
            if (id && bookingDate && bookingTime) {
                setIsFetchingTables(true);
                const tables = await dataStore.getTablesByRestaurant(id);
                // In a real app, we'd filter by actual availability for that slot
                setAvailableTables(tables.filter(t => t.capacity >= guests));
                setIsFetchingTables(false);
            }
        };
        fetchTables();
    }, [id, bookingDate, bookingTime, guests]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Restaurant not found</h2>
                <Button onClick={() => navigate('/')}>Go Back Home</Button>
            </div>
        );
    }

    const menuItems = restaurant.menu || [];
    const categories: { value: Category; label: string }[] = [
        { value: 'all', label: 'All Items' },
        { value: 'appetizer', label: 'Appetizers' },
        { value: 'main', label: 'Main Course' },
        { value: 'dessert', label: 'Desserts' },
        { value: 'beverage', label: 'Beverages' }
    ];

    const filteredItems = activeCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    const updateQuantity = (itemId: string, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [itemId]: Math.max(1, (prev[itemId] || 1) + delta)
        }));
    };

    const handleAddToCart = (item: MenuItem) => {
        const quantity = quantities[item.id] || 1;
        addToCart({
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            quantity
        });

        setAddedItems(prev => new Set(prev).add(item.id));
        toast.success(`Added ${quantity} x ${item.name} to cart`);

        setTimeout(() => {
            setAddedItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(item.id);
                return newSet;
            });
        }, 2000);
    };

    const handleBookTable = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!selectedTable || !bookingDate || !bookingTime) {
            toast.error('Please select date, time and a table');
            return;
        }

        setIsBooking(true);
        const reservation: Partial<Reservation> = {
            id: `res-${Date.now()}`,
            userId: user!.id,
            restaurantId: id,
            tableId: selectedTable.id,
            tableNumber: selectedTable.tableNumber,
            date: bookingDate,
            time: bookingTime,
            guests,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        const success = await dataStore.addReservation(reservation);
        if (success) {
            toast.success('Table reserved successfully!');
            navigate('/reservations');
        } else {
            toast.error('Failed to reserve table. Please try again.');
        }
        setIsBooking(false);
    };


    const timeSlots = [
        '11:00', '12:00', '13:00', '14:00', '17:00', '18:00', '19:00', '20:00', '21:00'
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[300px] md:h-[400px]">
                <img
                    src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <Button
                    variant="ghost"
                    className="absolute top-4 left-4 text-white hover:bg-white/20"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/80 to-transparent">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-orange-500 hover:bg-orange-600 border-none">
                                {restaurant.cuisineType}
                            </Badge>
                            <div className="flex items-center text-yellow-400">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="ml-1 font-bold">4.5</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">{restaurant.name}</h1>
                        <div className="flex flex-wrap gap-4 text-sm opacity-90">
                            <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {restaurant.address}</span>
                            <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {restaurant.openingTime} - {restaurant.closingTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs defaultValue="menu" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 h-18 bg-gray-200 rounded-xl border-none">
                        <TabsTrigger value="menu" className="py-3 font-bold">Menu</TabsTrigger>
                        <TabsTrigger id="booking-tab" value="booking" className="py-3 font-bold text-orange-600">Book a Table</TabsTrigger>
                    </TabsList>

                    <TabsContent value="menu">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Our Menu</h2>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <Button
                                        key={cat.value}
                                        variant={activeCategory === cat.value ? "default" : "ghost"}
                                        onClick={() => setActiveCategory(cat.value)}
                                        className={activeCategory === cat.value ? "bg-[#fc8019] hover:bg-orange-600" : ""}
                                    >
                                        {cat.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredItems.map(item => (
                                <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow border-gray-100 group">
                                    <div className="relative h-40">
                                        <img
                                            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                                            <span className="text-orange-600 font-bold">₹{item.price.toFixed(2)}</span>
                                        </div>
                                        <p className="text-gray-500 text-xs mb-4 h-8 line-clamp-2">{item.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-full bg-gray-100"><Minus className="h-3 w-3" /></button>
                                                <span className="text-sm font-bold">{quantities[item.id] || 1}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-full bg-gray-100"><Plus className="h-3 w-3" /></button>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => handleAddToCart(item)}
                                                className={addedItems.has(item.id) ? 'bg-green-500 hover:bg-green-600' : 'bg-[#fc8019] hover:bg-orange-600'}
                                            >
                                                {addedItems.has(item.id) ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="booking" className="space-y-8">
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Reservation Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="date"><Calendar className="inline h-4 w-4 mr-2" />Select Date</Label>
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={bookingDate}
                                                    onChange={(e) => setBookingDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="time"><Clock className="inline h-4 w-4 mr-2" />Select Time</Label>
                                                <select
                                                    id="time"
                                                    value={bookingTime}
                                                    onChange={(e) => setBookingTime(e.target.value)}
                                                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                                >
                                                    <option value="">Choose slot</option>
                                                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Label><Users className="inline h-4 w-4 mr-2" />Number of Guests</Label>
                                            <div className="flex items-center gap-4">
                                                <Button variant="outline" size="icon" onClick={() => setGuests(Math.max(1, guests - 1))}><Minus className="h-4 w-4" /></Button>
                                                <span className="text-2xl font-bold w-12 text-center">{guests}</span>
                                                <Button variant="outline" size="icon" onClick={() => setGuests(Math.min(12, guests + 1))}><Plus className="h-4 w-4" /></Button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Label><MapPin className="inline h-4 w-4 mr-2" />Available Tables</Label>
                                            {isFetchingTables ? (
                                                <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-orange-500" /></div>
                                            ) : bookingDate && bookingTime ? (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                    {availableTables.map(table => (
                                                        <button
                                                            key={table.id}
                                                            onClick={() => setSelectedTable(table)}
                                                            className={`p-4 rounded-xl border-2 text-left transition-all ${selectedTable?.id === table.id ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}
                                                        >
                                                            <p className="font-bold">Table {table.tableNumber}</p>
                                                            <p className="text-xs text-gray-500">{table.capacity} Seats • {table.location}</p>
                                                        </button>
                                                    ))}
                                                    {availableTables.length === 0 && (
                                                        <div className="col-span-full py-8 text-center bg-gray-50 rounded-xl">No tables found for this group size.</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center bg-gray-50 rounded-xl text-gray-500 border-2 border-dashed">
                                                    Please select a date and time to see availability.
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            className="w-full bg-[#fc8019] hover:bg-orange-600 h-12 text-lg font-bold"
                                            onClick={handleBookTable}
                                            disabled={isBooking || !selectedTable}
                                        >
                                            {isBooking ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Confirming...</> : 'Confirm Reservation'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card className="bg-orange-50 border-orange-100">
                                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5 text-orange-500" />Note</CardTitle></CardHeader>
                                    <CardContent className="text-sm text-gray-600 space-y-2">
                                        <p>• Tables are reserved for 2 hours.</p>
                                        <p>• Free cancellation up to 1 hour before.</p>
                                        <p>• Please arrive within 15 minutes of your booking time.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
