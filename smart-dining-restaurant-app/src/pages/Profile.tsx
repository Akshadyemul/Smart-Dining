import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dataStore } from '@/services/dataStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    User,
    Store,
    Phone,
    Mail,
    MapPin,
    Clock,
    ChefHat,
    Save,
    Lock,
    Loader2,
    Camera
} from 'lucide-react';
import { toast } from 'sonner';
import type { RestaurantProfile } from '@/types';
export default function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<RestaurantProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [tempProfile, setTempProfile] = useState<Partial<RestaurantProfile>>({});
    const restaurantImageRef = useRef<HTMLInputElement>(null);
    const ownerPhotoRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const fetchProfile = async () => {
            const data = await dataStore.getRestaurantProfile();
            if (data) {
                setProfile(data);
                setTempProfile(data);
            }
            setIsLoading(false);
        };
        fetchProfile();
    }, []);
    const handleSave = async () => {
        if (!tempProfile) return;
        setIsSaving(true);
        try {
            await dataStore.saveRestaurantProfile(tempProfile as RestaurantProfile);
            setProfile(tempProfile as RestaurantProfile);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'owner.photo') => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            if (field === 'image') {
                setTempProfile(prev => ({ ...prev, image: base64 }));
            } else {
                setTempProfile(prev => ({
                    ...prev,
                    owner: { ...prev.owner!, photo: base64 }
                }));
            }
        };
        reader.readAsDataURL(file);
    };
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
            </div>
        );
    }
    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>No profile found. Please register your restaurant first.</p>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-600">Manage your restaurant and account information</p>
                </div>
                <Tabs defaultValue="restaurant" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="restaurant">
                            <Store className="h-4 w-4 mr-2" />
                            Restaurant
                        </TabsTrigger>
                        <TabsTrigger value="owner">
                            <User className="h-4 w-4 mr-2" />
                            Owner
                        </TabsTrigger>
                        <TabsTrigger value="account">
                            <Lock className="h-4 w-4 mr-2" />
                            Account
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="restaurant">
                        <Card>
                            <CardHeader>
                                <CardTitle>Restaurant Details</CardTitle>
                                <CardDescription>Update your restaurant brand and contact info</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Restaurant Image */}
                                <div className="space-y-4">
                                    <Label>Restaurant Banner</Label>
                                    <div className="relative group w-full h-48 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center">
                                        {tempProfile.image ? (
                                            <img src={tempProfile.image} alt="Restaurant" className="w-full h-full object-cover" />
                                        ) : (
                                            <Store className="h-12 w-12 text-gray-300" />
                                        )}
                                        <div
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                            onClick={() => restaurantImageRef.current?.click()}
                                        >
                                            <Camera className="h-8 w-8 text-white" />
                                        </div>
                                        <input
                                            type="file"
                                            ref={restaurantImageRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'image')}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="res-name">Restaurant Name</Label>
                                        <div className="relative">
                                            <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="res-name"
                                                value={tempProfile.name || ''}
                                                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="res-phone">Restaurant Phone</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="res-phone"
                                                value={tempProfile.contactNumber || ''}
                                                onChange={(e) => setTempProfile({ ...tempProfile, contactNumber: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="res-email">Restaurant Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="res-email"
                                                value={tempProfile.email || ''}
                                                onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="res-cuisine">Cuisine Type</Label>
                                        <div className="relative">
                                            <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="res-cuisine"
                                                value={tempProfile.cuisineType || ''}
                                                onChange={(e) => setTempProfile({ ...tempProfile, cuisineType: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="res-address">Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Textarea
                                            id="res-address"
                                            value={tempProfile.address || ''}
                                            onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                                            className="pl-10 min-h-[80px]"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="res-open">Opening Time</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="res-open"
                                                type="time"
                                                value={tempProfile.openingTime || ''}
                                                onChange={(e) => setTempProfile({ ...tempProfile, openingTime: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="res-close">Closing Time</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="res-close"
                                                type="time"
                                                value={tempProfile.closingTime || ''}
                                                onChange={(e) => setTempProfile({ ...tempProfile, closingTime: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="res-special">Speciality / Signature Dish</Label>
                                    <Input
                                        id="res-special"
                                        value={tempProfile.speciality || ''}
                                        onChange={(e) => setTempProfile({ ...tempProfile, speciality: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="res-desc">Restaurant Description</Label>
                                    <Textarea
                                        id="res-desc"
                                        value={tempProfile.description || ''}
                                        onChange={(e) => setTempProfile({ ...tempProfile, description: e.target.value })}
                                        className="min-h-[100px]"
                                    />
                                </div>
                                <div className="flex justify-end gap-4 pt-4">
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="bg-orange-500 hover:bg-orange-600"
                                    >
                                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="owner">
                        <Card>
                            <CardHeader>
                                <CardTitle>Owner Information</CardTitle>
                                <CardDescription>Set your professional details as the restaurant owner</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col items-center gap-4 py-4">
                                    <div className="relative group">
                                        <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                                            {tempProfile.owner?.photo ? (
                                                <img src={tempProfile.owner.photo} alt="Owner" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="h-16 w-16 text-gray-300" />
                                            )}
                                        </div>
                                        <div
                                            className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                            onClick={() => ownerPhotoRef.current?.click()}
                                        >
                                            <Camera className="h-8 w-8 text-white" />
                                        </div>
                                        <input
                                            type="file"
                                            ref={ownerPhotoRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'owner.photo')}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500">Click to upload owner photo</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="owner-name">Full Name</Label>
                                        <Input
                                            id="owner-name"
                                            value={tempProfile.owner?.name || ''}
                                            onChange={(e) => setTempProfile({
                                                ...tempProfile,
                                                owner: { ...tempProfile.owner!, name: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="owner-phone">Personal Phone</Label>
                                        <Input
                                            id="owner-phone"
                                            value={tempProfile.owner?.phone || ''}
                                            onChange={(e) => setTempProfile({
                                                ...tempProfile,
                                                owner: { ...tempProfile.owner!, phone: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="owner-email">Work Email</Label>
                                        <Input
                                            id="owner-email"
                                            value={tempProfile.owner?.email || ''}
                                            onChange={(e) => setTempProfile({
                                                ...tempProfile,
                                                owner: { ...tempProfile.owner!, email: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-4 pt-4">
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="bg-orange-500 hover:bg-orange-600"
                                    >
                                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Details</CardTitle>
                                <CardDescription>Manage your sign-in credentials</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg flex items-center gap-4">
                                        <User className="h-10 w-10 text-orange-500 p-2 bg-white rounded-full" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{user?.name}</p>
                                            <p className="text-sm text-gray-600">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 pt-4 border-t">
                                        <Label htmlFor="acc-email">Login Email</Label>
                                        <Input
                                            id="acc-email"
                                            value={user?.email || ''}
                                            disabled
                                            className="bg-gray-50"
                                        />
                                        <p className="text-xs text-gray-500">User account email cannot be changed here</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <Input id="new-password" type="password" placeholder="••••••••" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                                        <Input id="confirm-password" type="password" placeholder="••••••••" />
                                    </div>
                                    <Button variant="outline" className="w-full">Update Password</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}