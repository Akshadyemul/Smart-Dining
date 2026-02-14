import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Search,
  Loader2,
  Upload
} from 'lucide-react';
import { dataStore } from '@/services/dataStore';
import type { MenuItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
export default function AdminMenu() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    image: '',
    isAvailable: true
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    const fetchMenu = async () => {
      console.log('Menu.tsx - Fetching menu items...');
      const data = await dataStore.getMenuItems();
      console.log('Menu.tsx - Fetched items:', data);
      setMenuItems(data);
    };
    fetchMenu();
  }, []);
  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'main',
      image: '',
      isAvailable: true
    });
    setIsDialogOpen(true);
  };
  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      isAvailable: item.isAvailable
    });
    setIsDialogOpen(true);
  };
  const handleDelete = async (item: MenuItem) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const success = await dataStore.deleteMenuItem(item.id);
      if (success) {
        const data = await dataStore.getMenuItems();
        setMenuItems(data);
        toast.success('Item deleted successfully');
      } else {
        toast.error('Failed to delete item');
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const itemData: MenuItem = {
      id: editingItem?.id || `menu-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category as MenuItem['category'],
      image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      isAvailable: formData.isAvailable
    };
    let success = false;
    if (editingItem) {
      success = await dataStore.updateMenuItem(itemData);
      if (success) toast.success('Item updated successfully');
    } else {
      success = await dataStore.addMenuItem(itemData);
      if (success) toast.success('Item added successfully');
    }

    if (success) {
      const data = await dataStore.getMenuItems();
      setMenuItems(data);
      setIsDialogOpen(false);
    } else {
      toast.error('Failed to save item. Please try again.');
    }
    setIsSubmitting(false);
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
  const categoryStats = {
    appetizer: menuItems.filter(i => i.category === 'appetizer').length,
    main: menuItems.filter(i => i.category === 'main').length,
    dessert: menuItems.filter(i => i.category === 'dessert').length,
    beverage: menuItems.filter(i => i.category === 'beverage').length
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-600 mt-1">Manage your restaurant menu items</p>
          </div>
          <Button onClick={handleAddNew} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
        {/* Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(categoryStats).map(([category, count]) => (
            <Card key={category}>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{category}s</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {/* Menu Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
                <Badge className={`absolute top-2 left-2 ${getCategoryColor(item.category)}`}>
                  {item.category}
                </Badge>
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary" className="text-lg">Not Available</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{item.name}</h3>
                  <span className="text-orange-500 font-bold">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.description}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="flex-1"
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No menu items found</p>
          </div>
        )}
      </div>
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  required
                >
                  <option value="appetizer">Appetizer</option>
                  <option value="main">Main Course</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <Label>Item Image</Label>
              <div className="flex flex-col items-center gap-4">
                {formData.image ? (
                  <div className="relative group w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setFormData({ ...formData, image: '' })}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-48 border-2 border-dashed flex flex-col items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-500"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-10 w-10 mb-2" />
                    <span>Click to upload image</span>
                  </Button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL (Optional)</Label>
                <Input
                  id="image"
                  value={formData.image.startsWith('data:') ? '' : formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500">Or paste an external image URL above</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isAvailable" className="cursor-pointer">Available for ordering</Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingItem ? 'Update Item' : 'Add Item'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
