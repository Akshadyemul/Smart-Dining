// User Types
export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'customer' | 'admin' | 'owner';
  isRestaurantOwner?: boolean;
  restaurantId?: string;
  createdAt?: string;
  updatedAt?: string;
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
  tableId: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
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

// Restaurant Types
export interface RestaurantProfile {
  id?: string;
  _id?: string;
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
    userId?: string;
    name: string;
    email: string;
    phone: string;
    photo: string;
  };
  tables: Table[];
  menu: MenuItem[];
  isActive?: boolean;
  registeredAt?: string;
  updatedAt?: string;
}

// Category Type
export type Category = 'all' | 'appetizer' | 'main' | 'dessert' | 'beverage';
