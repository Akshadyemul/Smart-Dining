import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dataStore } from '@/services/dataStore';
import type { RestaurantProfile } from '@/types';
import { ArrowLeft, Loader2, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AllRestaurants() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<RestaurantProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const data = await dataStore.getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(res => 
    res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    res.cuisineType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4 pl-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Restaurants</h1>
              <p className="text-gray-500 mt-1">Discover places to eat around you</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              type="text" 
              placeholder="Search by name, cuisine, or location..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((res) => (
                <Card
                  key={res.id}
                  className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow border-none bg-white group"
                  onClick={() => navigate('/book-table', { state: { restaurantId: res.id } })}
                >
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={res.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'}
                        alt={res.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-sm font-bold text-gray-900 border border-gray-100">
                        {res.cuisineType}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{res.name}</h3>
                      <p className="text-gray-500 text-sm flex items-start mb-4 h-10 line-clamp-2">
                        <MapPin className="h-4 w-4 mr-1 shrink-0 mt-0.5 text-orange-500" />
                        <span className="truncate whitespace-normal">{res.address}</span>
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          {res.openingTime} - {res.closingTime}
                        </span>
                        <div className="flex items-center text-yellow-500">
                          <span className="text-sm font-bold">4.5</span>
                          <span className="text-xs text-gray-400 ml-1">(100+)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-16 px-4 bg-white rounded-xl border border-dashed border-gray-200">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No restaurants found</h3>
                <p className="text-gray-500 mt-1 max-w-sm mx-auto">We couldn't find any restaurants matching your search criteria. Try a different query.</p>
                <Button 
                  variant="outline" 
                  className="mt-6 border-orange-200 text-orange-600 hover:bg-orange-50"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
