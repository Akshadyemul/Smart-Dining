// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer';
  createdAt: string;
}

// Table Types
export interface Table {
  id: string;
  tableNumber: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  qrCode: string;
  location: string;
}

// Menu Item Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  image: string;
  isAvailable: boolean;
}

// Reservation Types
export interface Reservation {
  id: string;
  userId: string;
  restaurantId: string;
  tableId: string;
  tableNumber: number;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  userName?: string;
  userPhone?: string;
  preOrderItems?: OrderItem[];
  specialRequests?: string;
  createdAt: string;
}

// Order Types
export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  restaurantId: string;
  tableId: string;
  tableNumber: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';
  paymentMethod?: 'online' | 'cash';
  paymentStatus: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem extends OrderItem { }

export interface Cart {
  items: CartItem[];
  tableId?: string;
  tableNumber?: number;
}

// Category Type
export type Category = 'all' | 'appetizer' | 'main' | 'dessert' | 'beverage';

// Restaurant Types
export interface RestaurantProfile {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  cuisineType: string;
  description?: string;
  openingTime: string;
  closingTime: string;
  image?: string;
  images: string[];
  ownerId: string;
  whenStarted: string;
  speciality: string;
  parkingAvailability: boolean;
  owner: {
    name: string;
    email: string;
    phone: string;
    photo: string;
  };
  tables: Table[];
  menu: MenuItem[];
}

