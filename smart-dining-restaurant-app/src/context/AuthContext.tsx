import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';
import { dataStore } from '@/services/dataStore';
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  hasRestaurant: boolean;
  isLoading: boolean;
  refreshRestaurantStatus: () => Promise<void>;
  setHasRestaurant: (has: boolean) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hasRestaurant, setHasRestaurantState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const setHasRestaurant = (has: boolean) => {
    setHasRestaurantState(has);
  };

  const refreshRestaurantStatus = async () => {
    // First check if user object has restaurantId (from login/register response)
    if (user) {
      if (user.restaurantId || user.isRestaurantOwner) {
        setHasRestaurantState(true);
        return;
      }
    }
    // If not, try to fetch from API
    const profile = await dataStore.getRestaurantProfile();
    setHasRestaurantState(!!profile);
  };
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Check if user has restaurant from stored data
        if (parsedUser.restaurantId || parsedUser.isRestaurantOwner) {
          setHasRestaurantState(true);
        } else {
          await refreshRestaurantStatus();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const user = await dataStore.login(email, password);
      if (user) {
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Check if user has restaurant from login response
        if (user.restaurantId || user.isRestaurantOwner) {
          setHasRestaurantState(true);
        } else {
          await refreshRestaurantStatus();
        }
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const register = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    const newUser: Partial<User> = {
      name,
      email,
      password,
      phone,
      role: 'customer'
    };
    setIsLoading(true);
    try {
      const registeredUser = await dataStore.register(newUser as User);
      if (registeredUser) {
        setUser(registeredUser);
        localStorage.setItem('currentUser', JSON.stringify(registeredUser));
        await refreshRestaurantStatus();
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    setUser(null);
    setHasRestaurantState(false);
    localStorage.removeItem('currentUser');
  };
  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isOwner: user?.role === 'owner',
      hasRestaurant,
      isLoading,
      refreshRestaurantStatus,
      setHasRestaurant
    }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
