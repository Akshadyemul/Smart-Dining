import axios from 'axios';
import type { User, Table, MenuItem, Reservation, Order, RestaurantProfile } from '@/types';
const API_URL = 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    // Use id first, then _id as fallback
    const userId = user.id || user._id;
    if (userId) {
      config.headers['x-user-id'] = userId;
      console.log('API Request Interceptor - Adding x-user-id:', userId);
    } else {
      console.warn('API Request Interceptor - No userId found in localStorage user object');
    }
  }
  return config;
});
export const dataStore = {
  // Restaurant Profile
  async getRestaurantProfile(): Promise<RestaurantProfile | null> {
    try {
      const response = await api.get('/restaurant/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant profile:', error);
      return null;
    }
  },
  async saveRestaurantProfile(profile: RestaurantProfile): Promise<RestaurantProfile | null> {
    try {
      const response = await api.post('/restaurant/profile', profile);
      return response.data;
    } catch (error) {
      console.error('Error saving restaurant profile:', error);
      throw error;
    }
  },
  // Tables
  async getTables(): Promise<Table[]> {
    try {
      const profile = await this.getRestaurantProfile();
      return profile?.tables || [];
    } catch (error) {
      console.error('Error getting tables from profile:', error);
      return [];
    }
  },
  async getTableById(id: string): Promise<Table | undefined> {
    const tables = await this.getTables();
    return tables.find(t => t.id === id);
  },
  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const profile = await this.getRestaurantProfile();
      return profile?.menu || [];
    } catch (error) {
      console.error('Error getting menu items from profile:', error);
      return [];
    }
  },
  // Reservations
  async getReservations(): Promise<Reservation[]> {
    try {
      const response = await api.get('/transactions/reservations');
      return response.data;
    } catch (error) {
      return [];
    }
  },
  async addReservation(reservation: Reservation): Promise<void> {
    try {
      await api.post('/transactions/reservations', reservation);
    } catch (error) {
      console.error('Error adding reservation:', error);
      throw error;
    }
  },
  async updateReservation(reservation: Reservation): Promise<void> {
    try {
      await api.put(`/transactions/reservations/${reservation.id}`, reservation);
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  },
  // Users
  async getUserById(id: string): Promise<User | undefined> {
    try {
      const response = await api.get(`/restaurant-owners/${id}`);
      return response.data;
    } catch (error) {
      return undefined;
    }
  },
  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await api.post('/restaurant-owners/login', { email, password });
      return response.data;
    } catch (error) {
      return null;
    }
  },
  async register(user: User): Promise<User | null> {
    try {
      const response = await api.post('/restaurant-owners/register', user);
      return response.data;
    } catch (error) {
      return null;
    }
  },
  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const response = await api.get('/transactions/orders');
      return response.data;
    } catch (error) {
      return [];
    }
  },
  async addOrder(order: Order): Promise<void> {
    try {
      await api.post('/transactions/orders', order);
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },
  async updateOrder(order: Order): Promise<void> {
    try {
      await api.put(`/transactions/orders/${order.id}`, order);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },
  async updateTable(table: Table): Promise<boolean> {
    const profile = await this.getRestaurantProfile();
    if (!profile) return false;
    const index = profile.tables.findIndex(t => t.id === table.id);
    if (index !== -1) {
      profile.tables[index] = table;
      await this.saveRestaurantProfile(profile);
      return true;
    }
    return false;
  },
  async addTable(table: Table): Promise<boolean> {
    const profile = await this.getRestaurantProfile();
    if (!profile) return false;
    profile.tables.push(table);
    await this.saveRestaurantProfile(profile);
    return true;
  },
  async deleteTable(id: string): Promise<boolean> {
    const profile = await this.getRestaurantProfile();
    if (!profile) return false;
    profile.tables = profile.tables.filter(t => t.id !== id);
    await this.saveRestaurantProfile(profile);
    return true;
  },
  async updateMenuItem(item: MenuItem): Promise<boolean> {
    const profile = await this.getRestaurantProfile();
    if (!profile) return false;
    const index = profile.menu.findIndex(i => i.id === item.id);
    if (index !== -1) {
      profile.menu[index] = item;
      await this.saveRestaurantProfile(profile);
      return true;
    }
    return false;
  },
  async addMenuItem(item: MenuItem): Promise<boolean> {
    const profile = await this.getRestaurantProfile();
    if (!profile) return false;
    profile.menu.push(item);
    await this.saveRestaurantProfile(profile);
    return true;
  },
  async deleteMenuItem(id: string): Promise<boolean> {
    const profile = await this.getRestaurantProfile();
    if (!profile) return false;
    profile.menu = profile.menu.filter(item => item.id !== id);
    await this.saveRestaurantProfile(profile);
    return true;
  }
};
