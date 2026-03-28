import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Order } from '@/types';
import { dataStore } from '@/services/dataStore';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  tableId: string | null;
  tableNumber: number | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  setTableInfo: (tableId: string, tableNumber: number) => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  placeOrder: () => Promise<Order | null>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [tableId, setTableId] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedTable = localStorage.getItem('tableInfo');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedTable) {
      const { tableId, tableNumber } = JSON.parse(savedTable);
      setTableId(tableId);
      setTableNumber(tableNumber);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (tableId && tableNumber) {
      localStorage.setItem('tableInfo', JSON.stringify({ tableId, tableNumber }));
    }
  }, [tableId, tableNumber]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      if (prev.length > 0) {
        const existingRestaurantId = prev[0].restaurantId;
        if (item.restaurantId && existingRestaurantId && item.restaurantId !== existingRestaurantId) {
          toast.error("You can only order from one restaurant at a time. Please clear your cart first.");
          return prev;
        }
      }

      const existingItem = prev.find(i => i.menuItemId === item.menuItemId);
      if (existingItem) {
        return prev.map(i =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCartItems(prev => prev.filter(i => i.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(i =>
        i.menuItemId === menuItemId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const setTableInfo = (id: string, number: number) => {
    setTableId(id);
    setTableNumber(number);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const placeOrder = async (): Promise<Order | null> => {
    if (!tableId || cartItems.length === 0) return null;

    const order: Partial<Order> = {
      id: `order-${Date.now()}`,
      userId: user?.id,
      restaurantId: cartItems[0]?.restaurantId || '',
      tableId,
      tableNumber: tableNumber!,
      items: [...cartItems],
      totalAmount: getCartTotal(),
      status: 'pending',
      paymentStatus: 'pending',
    };

    const savedOrder = await dataStore.addOrder(order);

    if (savedOrder) {
      clearCart();
      return savedOrder;
    }

    return null;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      tableId,
      tableNumber,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      setTableInfo,
      getCartTotal,
      getItemCount,
      placeOrder
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
