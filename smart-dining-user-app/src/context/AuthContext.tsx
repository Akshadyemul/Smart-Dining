import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';
import { dataStore } from '@/services/dataStore';

interface AuthContextType {
  user: User | null;
  login: (phone: string, otp: string) => Promise<{ success: boolean; message?: string; needsRegistration?: boolean }>;
  register: (name: string, email: string, phone: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, otp: string): Promise<{ success: boolean; message?: string; needsRegistration?: boolean }> => {
    setIsLoading(true);
    try {
      const result = await dataStore.login(phone, otp);

      if (result) {
        if ('needsRegistration' in result && result.needsRegistration) {
          return { success: true, needsRegistration: true };
        }

        const foundUser = result as User;
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        return { success: true };
      }

      return { success: false, message: 'Login failed. Check phone or OTP (Demo: 1234)' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newUser = await dataStore.register({ name, email, phone });
      if (newUser) {
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isLoading
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
