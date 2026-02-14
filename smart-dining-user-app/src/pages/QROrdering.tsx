import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { dataStore } from '@/services/dataStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  QrCode,
  MapPin,
  Users,
  Check,
  ArrowRight,
  ShoppingCart,
  Info,
  Loader2
} from 'lucide-react';
import type { MenuItem } from '@/types';
import { toast } from 'sonner';

export default function QROrdering() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { setTableInfo, addToCart, getItemCount } = useCart();
  const [table, setTable] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [isValidTable, setIsValidTable] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (tableId) {
        setIsLoading(true);
        const foundTable = await dataStore.getTableById(tableId);
        if (foundTable) {
          setTable(foundTable);
          setTableInfo(foundTable.id, foundTable.tableNumber);
          const items = await dataStore.getMenuItems();
          setMenuItems(items.filter(item => item.isAvailable));
        } else {
          setIsValidTable(false);
        }
        setIsLoading(false);
      }
    };
    fetchData();
  }, [tableId, setTableInfo]);

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
    toast.success(`Added ${quantity} x ${item.name}`);

    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 2000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'appetizer': return 'bg-green-100 text-green-800';
      case 'main': return 'bg-orange-100 text-orange-800';
      case 'dessert': return 'bg-pink-100 text-pink-800';
      case 'beverage': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isValidTable) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Invalid Table</h2>
              <p className="text-gray-600 mb-6">
                The QR code you scanned is invalid or the table doesn't exist.
              </p>
              <Button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const cartItemCount = getItemCount();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Table Info Header */}
        <Card className="mb-6 bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="h-6 w-6" />
                  <h1 className="text-2xl font-bold">Table {table?.tableNumber}</h1>
                </div>
                <div className="flex items-center gap-4 text-orange-100">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {table?.location}
                  </span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {table?.capacity} seats
                  </span>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-white/20 text-white border-0">
                  QR Ordering Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Welcome Message */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800">
            Welcome! Browse our menu and add items to your cart. Your order will be delivered to Table {table?.tableNumber}.
          </AlertDescription>
        </Alert>

        {/* Cart Summary Bar */}
        {cartItemCount > 0 && (
          <div className="sticky top-20 z-10 mb-6">
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-orange-500 mr-3" />
                  <div>
                    <p className="font-medium">{cartItemCount} items in cart</p>
                    <p className="text-sm text-gray-600">Ready to checkout?</p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/cart')}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  View Cart
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Menu */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Our Menu</h2>

          {/* Categories */}
          {['appetizer', 'main', 'dessert', 'beverage'].map(category => {
            const categoryItems = menuItems.filter(item => item.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold mb-4 capitalize flex items-center">
                  <Badge className={`mr-2 ${getCategoryColor(category)}`}>
                    {category}
                  </Badge>
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {categoryItems.map(item => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover"
                        />
                        <CardContent className="p-4 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{item.name}</h4>
                              <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                              <p className="text-orange-500 font-bold mt-1">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-sm">
                                {quantities[item.id] || 1}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                              >
                                +
                              </button>
                            </div>

                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(item)}
                              className={addedItems.has(item.id)
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-orange-500 hover:bg-orange-600'
                              }
                            >
                              {addedItems.has(item.id) ? (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Added
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="h-4 w-4 mr-1" />
                                  Add
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
