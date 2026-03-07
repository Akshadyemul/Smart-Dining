import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { dataStore } from '@/services/dataStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Minus, ShoppingCart, Check, Loader2 } from 'lucide-react';
import type { MenuItem, Category } from '@/types';
import { toast } from 'sonner';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      const items = await dataStore.getMenuItems();
      setMenuItems(items.filter(item => item.isAvailable));
      setIsLoading(false);
    };
    fetchMenu();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Menu
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our delicious selection of dishes prepared by expert chefs
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as Category)} className="mb-8">
          <TabsList className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="px-4 py-2"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <Badge className={`absolute top-2 left-2 ${getCategoryColor(item.category)}`}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Badge>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <span className="text-orange-500 font-bold text-lg">
                    ₹{item.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {quantities[item.id] || 1}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
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
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
