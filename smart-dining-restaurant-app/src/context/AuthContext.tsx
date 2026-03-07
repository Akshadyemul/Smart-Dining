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
  restaurantStatusResolved: boolean;
  isLoading: boolean;
  refreshRestaurantStatus: (targetUser?: User | null) => Promise<void>;
  setHasRestaurant: (has: boolean) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hasRestaurant, setHasRestaurantState] = useState<boolean>(false);
  const [restaurantStatusResolved, setRestaurantStatusResolved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const persistCurrentUser = (nextUser: User) => {
    try {
      localStorage.setItem('currentUser', JSON.stringify(nextUser));
    } catch (error) {
      console.warn('Failed to persist currentUser in localStorage:', error);
    }
  };

  const setHasRestaurant = (has: boolean) => {
    setHasRestaurantState(has);
    setRestaurantStatusResolved(true);
  };

  const refreshRestaurantStatus = async (targetUser?: User | null) => {
    setRestaurantStatusResolved(false);
    const effectiveUser = targetUser ?? user;

    if (!effectiveUser) {
      setHasRestaurantState(false);
      setRestaurantStatusResolved(true);
      return;
    }

    // Use an explicit restaurant reference when available to avoid an extra request.
    if (effectiveUser.restaurantId) {
      setHasRestaurantState(true);
      setRestaurantStatusResolved(true);
      return;
    }

    try {
      // Fall back to profile lookup, which is the source of truth for registration state.
      const userId = effectiveUser.id || effectiveUser._id;
      const profile = userId
        ? await dataStore.getRestaurantProfileByUserId(userId)
        : await dataStore.getRestaurantProfile();
      setHasRestaurantState(!!profile);
    } catch {
      setHasRestaurantState(false);
    } finally {
      setRestaurantStatusResolved(true);
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('currentUser');
      try {
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          await refreshRestaurantStatus(parsedUser);
        } else {
          setHasRestaurantState(false);
          setRestaurantStatusResolved(true);
        }
      } catch {
        setUser(null);
        setHasRestaurantState(false);
        setRestaurantStatusResolved(true);
        localStorage.removeItem('currentUser');
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const loggedInUser = await dataStore.login(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        persistCurrentUser(loggedInUser);
        await refreshRestaurantStatus(loggedInUser);
        return true;
      }
      setHasRestaurantState(false);
      setRestaurantStatusResolved(true);
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
        persistCurrentUser(registeredUser);
        await refreshRestaurantStatus(registeredUser);
        return true;
      }
      setHasRestaurantState(false);
      setRestaurantStatusResolved(true);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    setUser(null);
    setHasRestaurantState(false);
    setRestaurantStatusResolved(true);
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
      restaurantStatusResolved,
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
