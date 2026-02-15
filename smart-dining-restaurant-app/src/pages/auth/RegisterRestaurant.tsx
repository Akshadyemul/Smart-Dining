import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Utensils, Loader2, MapPin, Phone, Clock, Store, FileText, ChefHat, Trash2, Upload, User, Mail, Calendar, DollarSign, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { dataStore } from '@/services/dataStore';
import type { RestaurantProfile, MenuItem, Table } from '@/types';
export default function RegisterRestaurant() {
    const navigate = useNavigate();
    const { user, hasRestaurant, setHasRestaurant, isLoading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        owner: {
            name: '',
            email: '',
            phone: '',
            photo: ''
        },
        restaurant: {
            name: '',
            address: '',
            contactNumber: '',
            email: '',
            cuisineType: '',
            description: '',
            openingTime: '09:00',
            closingTime: '22:00',
            whenStarted: '',
            speciality: '',
            parkingAvailability: false,
            images: [] as string[],
            image: ''
        },
        tables: [] as Table[],
        menu: [] as MenuItem[]
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const ownerPhotoInputRef = useRef<HTMLInputElement>(null);
    const menuPhotoInputRef = useRef<HTMLInputElement>(null);
    const [currentMenuItem, setCurrentMenuItem] = useState<Partial<MenuItem>>({
        name: '',
        price: 0,
        category: 'main',
        image: ''
    });
    const [tableCount, setTableCount] = useState(1);

    // Redirect if already has restaurant
    useEffect(() => {
        if (!authLoading && hasRestaurant) {
            navigate('/dashboard', { replace: true });
        }
    }, [hasRestaurant, authLoading, navigate]);

    // Pre-fill owner data with current user
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                owner: {
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    photo: ''
                }
            }));
        }
    }, [user]);
    const handleNestedChange = (section: 'owner' | 'restaurant', field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (!formData.restaurant.images.includes(base64String)) {
                    setFormData(prev => ({
                        ...prev,
                        restaurant: {
                            ...prev.restaurant,
                            image: prev.restaurant.image || base64String,
                            images: [...prev.restaurant.images, base64String]
                        }
                    }));
                }
            };
            reader.readAsDataURL(file);
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    const handleOwnerPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            handleNestedChange('owner', 'photo', reader.result as string);
        };
        reader.readAsDataURL(file);
    };
    const removeImage = (urlToRemove: string) => {
        setFormData(prev => {
            const newImages = prev.restaurant.images.filter(url => url !== urlToRemove);
            return {
                ...prev,
                restaurant: {
                    ...prev.restaurant,
                    images: newImages,
                    image: prev.restaurant.image === urlToRemove ? (newImages[0] || '') : prev.restaurant.image
                }
            };
        });
    };
    const addMenuItem = (item: Partial<MenuItem>) => {
        const newItem: MenuItem = {
            id: `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: item.name || '',
            description: item.description || '',
            price: item.price || 0,
            category: item.category || 'main',
            image: item.image || '',
            isAvailable: true
        };
        setFormData(prev => ({
            ...prev,
            menu: [...prev.menu, newItem]
        }));
    };
    const removeMenuItem = (id: string) => {
        setFormData(prev => ({
            ...prev,
            menu: prev.menu.filter(item => item.id !== id)
        }));
    };
    const addTable = (count: number) => {
        const newTables: Table[] = Array.from({ length: count }).map((_, i) => ({
            id: `table-${Date.now()}-${i}`,
            tableNumber: formData.tables.length + i + 1,
            capacity: 4,
            status: 'available',
            qrCode: '',
            location: 'Main Hall'
        }));
        setFormData(prev => ({
            ...prev,
            tables: [...prev.tables, ...newTables]
        }));
    };
    const removeTable = (id: string) => {
        setFormData(prev => ({
            ...prev,
            tables: prev.tables.filter(table => table.id !== id)
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
            return;
        }
        if (!user) {
            setError('You must be logged in to register a restaurant');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const profile: RestaurantProfile = {
                id: `rest-${Date.now()}`,
                ownerId: user.id || user._id || '',
                name: formData.restaurant.name,
                address: formData.restaurant.address,
                contactNumber: formData.restaurant.contactNumber,
                email: formData.restaurant.email,
                cuisineType: formData.restaurant.cuisineType,
                description: formData.restaurant.description,
                openingTime: formData.restaurant.openingTime,
                closingTime: formData.restaurant.closingTime,
                image: formData.restaurant.image,
                images: formData.restaurant.images,
                whenStarted: formData.restaurant.whenStarted,
                speciality: formData.restaurant.speciality,
                parkingAvailability: formData.restaurant.parkingAvailability,
                owner: {
                    userId: user.id || user._id || '',
                    name: formData.owner.name,
                    email: formData.owner.email,
                    phone: formData.owner.phone,
                    photo: formData.owner.photo
                },
                tables: formData.tables,
                menu: formData.menu
            };
            const savedProfile = await dataStore.saveRestaurantProfile(profile);
            if (savedProfile) {
                setHasRestaurant(true);
                navigate('/dashboard');
            } else {
                setError('Failed to save restaurant. Please try again.');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to save restaurant details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Store className="h-12 w-12 text-orange-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Register Your Restaurant</CardTitle>
                    <CardDescription>Tell us about your dining establishment</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {/* Step Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between relative">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex flex-col items-center relative z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= s ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-gray-300 text-gray-400'
                                        }`}>
                                        {step > s ? <CheckCircle2 className="h-6 w-6" /> : s}
                                    </div>
                                    <span className={`text-xs mt-2 font-medium ${step >= s ? 'text-orange-500' : 'text-gray-400'}`}>
                                        {s === 1 ? 'Owner' : s === 2 ? 'Restaurant' : 'Setup'}
                                    </span>
                                </div>
                            ))}
                            <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-0">
                                <div
                                    className="h-full bg-orange-500 transition-all duration-300"
                                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="flex flex-col items-center mb-6">
                                    <Label className="mb-4">Owner Photo</Label>
                                    <div
                                        onClick={() => ownerPhotoInputRef.current?.click()}
                                        className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-orange-500 transition-colors bg-gray-50"
                                    >
                                        {formData.owner.photo ? (
                                            <img src={formData.owner.photo} alt="Owner" className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload className="h-8 w-8 text-gray-400" />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={ownerPhotoInputRef}
                                        onChange={handleOwnerPhotoUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Click to upload owner's profile picture</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="ownerName">Owner Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="ownerName"
                                                placeholder="Enter full name"
                                                value={formData.owner.name}
                                                onChange={(e) => handleNestedChange('owner', 'name', e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ownerEmail">Owner Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="ownerEmail"
                                                type="email"
                                                placeholder="owner@example.com"
                                                value={formData.owner.email}
                                                onChange={(e) => handleNestedChange('owner', 'email', e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ownerPhone">Owner Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="ownerPhone"
                                                placeholder="+1 234 567 890"
                                                value={formData.owner.phone}
                                                onChange={(e) => handleNestedChange('owner', 'phone', e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Restaurant Name</Label>
                                        <div className="relative">
                                            <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="name"
                                                placeholder="e.g. The Golden Spoon"
                                                value={formData.restaurant.name}
                                                onChange={(e) => handleNestedChange('restaurant', 'name', e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cuisineType">Cuisine Type</Label>
                                        <div className="relative">
                                            <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="cuisineType"
                                                placeholder="e.g. Italian, Indian"
                                                value={formData.restaurant.cuisineType}
                                                onChange={(e) => handleNestedChange('restaurant', 'cuisineType', e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="whenStarted">When did it start?</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="whenStarted"
                                                type="date"
                                                value={formData.restaurant.whenStarted}
                                                onChange={(e) => handleNestedChange('restaurant', 'whenStarted', e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="speciality">Speciality Dishe(s)</Label>
                                        <div className="relative">
                                            <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="speciality"
                                                placeholder="e.g. Pasta, Tandoori"
                                                value={formData.restaurant.speciality}
                                                onChange={(e) => handleNestedChange('restaurant', 'speciality', e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contactNumber">Restaurant Contact</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="contactNumber"
                                                placeholder="+1 234 567 890"
                                                value={formData.restaurant.contactNumber}
                                                onChange={(e) => handleNestedChange('restaurant', 'contactNumber', e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Restaurant Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="rest@example.com"
                                                value={formData.restaurant.email}
                                                onChange={(e) => handleNestedChange('restaurant', 'email', e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="address">Location / Address</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="address"
                                                placeholder="123 Main St, City, Country"
                                                value={formData.restaurant.address}
                                                onChange={(e) => handleNestedChange('restaurant', 'address', e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="openingTime">Opening Time</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="openingTime"
                                                type="time"
                                                value={formData.restaurant.openingTime}
                                                onChange={(e) => handleNestedChange('restaurant', 'openingTime', e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="closingTime">Closing Time</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="closingTime"
                                                type="time"
                                                value={formData.restaurant.closingTime}
                                                onChange={(e) => handleNestedChange('restaurant', 'closingTime', e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2">
                                        <input
                                            type="checkbox"
                                            id="parking"
                                            checked={formData.restaurant.parkingAvailability}
                                            onChange={(e) => handleNestedChange('restaurant', 'parkingAvailability', e.target.checked)}
                                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                        />
                                        <Label htmlFor="parking">Parking Availability</Label>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="description">Description</Label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <textarea
                                                id="description"
                                                rows={3}
                                                placeholder="Briefly describe your restaurant..."
                                                value={formData.restaurant.description}
                                                onChange={(e) => handleNestedChange('restaurant', 'description', e.target.value)}
                                                className="w-full min-h-[80px] pl-10 px-3 py-2 rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4 md:col-span-2">
                                        <Label>Restaurant Photos</Label>
                                        <div className="flex flex-col gap-4">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                accept="image/*"
                                                multiple
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full h-24 border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:border-orange-500 hover:text-orange-500 transition-colors"
                                            >
                                                <Upload className="h-8 w-8" />
                                                <span>Click to upload restaurant photos</span>
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                                            {formData.restaurant.images.map((url, index) => (
                                                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
                                                    <img src={url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(url)}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                {/* Tables Setup */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Store className="h-5 w-5 text-orange-500" />
                                        <h3 className="text-lg font-semibold">Table Setup</h3>
                                    </div>
                                    <div className="flex gap-4 items-end bg-orange-50 p-4 rounded-lg">
                                        <div className="space-y-2 flex-1">
                                            <Label>Number of Tables to Add</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={tableCount}
                                                onChange={(e) => setTableCount(parseInt(e.target.value) || 1)}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => addTable(tableCount)}
                                            className="bg-orange-500 hover:bg-orange-600"
                                        >
                                            Add {tableCount} Tables
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tables.map((table) => (
                                            <div key={table.id} className="flex items-center gap-2 bg-white border px-3 py-1 rounded-full text-sm">
                                                <span>Table {table.tableNumber}</span>
                                                <button onClick={() => removeTable(table.id)} className="text-red-500 hover:text-red-700">
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Menu Setup */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Utensils className="h-5 w-5 text-orange-500" />
                                        <h3 className="text-lg font-semibold">Initial Menu</h3>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Item Image</Label>
                                                <div
                                                    onClick={() => menuPhotoInputRef.current?.click()}
                                                    className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden cursor-pointer bg-white"
                                                >
                                                    {currentMenuItem.image ? (
                                                        <img src={currentMenuItem.image} alt="Menu preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Upload className="h-6 w-6 text-gray-400" />
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={menuPhotoInputRef}
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => setCurrentMenuItem(prev => ({ ...prev, image: reader.result as string }));
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="space-y-2">
                                                <Label>Item Name</Label>
                                                <Input
                                                    value={currentMenuItem.name}
                                                    onChange={(e) => setCurrentMenuItem(prev => ({ ...prev, name: e.target.value }))}
                                                    placeholder="e.g. Signature Pizza"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Price</Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        type="number"
                                                        value={currentMenuItem.price}
                                                        onChange={(e) => setCurrentMenuItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full mt-2"
                                                onClick={() => {
                                                    if (currentMenuItem.name && currentMenuItem.price) {
                                                        addMenuItem(currentMenuItem);
                                                        setCurrentMenuItem({ name: '', price: 0, category: 'main', image: '' });
                                                    }
                                                }}
                                            >
                                                Add to Menu
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {formData.menu.map((item) => (
                                            <div key={item.id} className="flex gap-3 p-2 border rounded-lg items-center bg-white">
                                                <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} className="w-12 h-12 rounded object-cover" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{item.name}</p>
                                                    <p className="text-sm text-gray-500">${item.price}</p>
                                                </div>
                                                <button onClick={() => removeMenuItem(item.id)} className="text-red-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex gap-4 pt-4">
                            {step > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(step - 1)}
                                    className="flex-1"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                            )}
                            <Button
                                type="submit"
                                className="flex-[2] bg-orange-500 hover:bg-orange-600 h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        {step === 3 ? 'Complete Registration' : 'Next Step'}
                                        {step < 3 && <ChevronRight className="h-4 w-4 ml-2" />}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}