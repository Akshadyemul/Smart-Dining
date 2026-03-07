import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { dataStore } from '@/services/dataStore';
import type { RestaurantProfile } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("Bhavani Peth, Solapur");
  const [restaurants, setRestaurants] = useState<RestaurantProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await dataStore.getRestaurants();
      setRestaurants(data);
      setIsLoading(false);
    };
    fetchRestaurants();
  }, []);

  const locations = [
    "Bhavani Peth, Solapur",
    "Hotgi Road, Solapur",
    "Ashok Chowk, Solapur",
    "Saat Rasta, Solapur"
  ];

  // const bestFood = [
  //   { name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop' },
  //   { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop' },
  //   { name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
  //   { name: 'Rolls', image: 'https://images.unsplash.com/photo-1533777419517-3bf84dd3815b?w=200&h=200&fit=crop' },
  //   { name: 'Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop' },
  //   { name: 'Ice Cream', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&h=200&fit=crop' },
  // ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#fc8019] text-white pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1200&q=80"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/70 to-orange-500/50"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-12 relative z-10">
          <div className="space-y-8 w-full max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Order food & tables. <br />
              Discover best dining experiences. <br />
              <span className="opacity-90 text-yellow-200">Smart Dining it!</span>
            </h1>

            <div className="bg-white p-1.5 rounded-lg flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-2xl items-center">
              <div className="relative flex-1 w-full sm:w-auto min-w-[200px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 h-12 w-full justify-start pl-2 hover:bg-transparent"
                    >
                      <span className="mr-2 text-xl">📍</span>
                      <span className="text-gray-700 font-medium truncate flex-1 text-left">
                        {location}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    {locations.map((loc) => (
                      <DropdownMenuItem key={loc} onClick={() => setLocation(loc)}>
                        {loc}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="h-px w-full sm:h-8 sm:w-px bg-gray-200" />
              <div className="relative flex-[1.5] w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  className="pl-10 border-none shadow-none text-gray-700 font-medium focus-visible:ring-0 h-12"
                  placeholder="Search for restaurants, items or more"
                />
              </div>
              <Button className="bg-[#fc8019] hover:bg-orange-600 text-white font-bold px-8 h-12 w-full sm:w-auto transition-colors">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Restaurants Section */}
      <div className="bg-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Popular Restaurants in {location.split(',')[0]}
            </h2>
            <Button variant="ghost" className="text-orange-500 font-bold">
              See all <MoveRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-xl" />
              ))
            ) : restaurants.length > 0 ? (
              restaurants.map((res) => (
                <Card
                  key={res.id}
                  className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow border-none bg-gray-50 group"
                  onClick={() => navigate(`/restaurant/${res.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={res.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'}
                        alt={res.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-sm font-bold text-gray-900">
                        {res.cuisineType}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{res.name}</h3>
                      <p className="text-gray-500 text-sm flex items-center mb-3">
                        <span className="truncate">{res.address}</span>
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          Open: {res.openingTime} - {res.closingTime}
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
              <div className="col-span-full py-12 text-center text-gray-500">
                No restaurants found in this area yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Best Food Section */}
      {/* <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Order our best food options
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
          {bestFood.map((food, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 cursor-pointer group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-[#fc8019] transition-colors">
                {food.name}
              </span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
