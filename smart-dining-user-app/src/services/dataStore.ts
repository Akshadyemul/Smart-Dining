import type { User, Table, MenuItem, Reservation, Order, RestaurantProfile } from '@/types';
import api from './axiosConfig';

class DataStore {
  // Restaurants
  async getRestaurants(): Promise<RestaurantProfile[]> {
    try {
      const response = await api.get('/restaurant');
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  }

  async getRestaurantDetail(id: string): Promise<RestaurantProfile | null> {
    try {
      const response = await api.get(`/restaurant/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant detail:', error);
      return null;
    }
  }

  // Legacy/Global Menu Support
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const restaurants = await api.get('/restaurant');
      const allMenus = await Promise.all(
        restaurants.data.map(async (r: any) => {
          const detail = await this.getRestaurantDetail(r._id || r.id);
          return detail?.menu || [];
        })
      );
      return allMenus.flat();
    } catch (error) {
      console.error('Error fetching all menu items:', error);
      return [];
    }
  }

  // Table lookup across all restaurants
  async getTableById(tableId: string): Promise<Table | null> {
    try {
      const restaurants = await this.getRestaurants();
      for (const res of restaurants) {
        const detail = await this.getRestaurantDetail(res.id);
        const table = detail?.tables.find(t => t.id === tableId);
        if (table) return table;
      }
      return null;
    } catch (error) {
      console.error('Error finding table by ID:', error);
      return null;
    }
  }

  // Users
  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async register(userData: Partial<User>): Promise<User | null> {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  }

  async login(phone: string, otp: string): Promise<User | null | { phone: string; needsRegistration: boolean }> {
    // Demo mode: OTP "1234"
    if (otp === '1234') {
      try {
        // Try to find the user by phone number
        const response = await api.get(`/users/phone/${phone}`);
        if (response.data) {
          return response.data; // Existing user found
        }
      } catch (error) {
        console.error('User not found or error fetching user:', error);
        // User not found, but OTP is correct (demo mode), so proceed to registration
        return { phone, needsRegistration: true };
      }
    }

    try {
      const response = await api.post('/users/login', { phone, otp });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  // Reservations
  async getReservationsByUser(): Promise<Reservation[]> {
    try {
      const response = await api.get('/transactions/reservations');
      return response.data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }
  }

  async getReservationById(id: string): Promise<Reservation | null> {
    try {
      const response = await api.get(`/transactions/reservations/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async addReservation(reservation: Partial<Reservation>): Promise<Reservation | null> {
    try {
      const response = await api.post('/transactions/reservations', reservation);
      return response.data;
    } catch (error) {
      console.error('Error adding reservation:', error);
      return null;
    }
  }

  async updateReservation(reservation: Partial<Reservation>): Promise<Reservation | null> {
    try {
      const response = await api.put(`/transactions/reservations/${reservation.id}`, reservation);
      return response.data;
    } catch (error) {
      console.error('Error updating reservation:', error);
      return null;
    }
  }

  // Orders
  async getOrdersByUser(): Promise<Order[]> {
    try {
      const response = await api.get('/transactions/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const response = await api.get(`/transactions/orders/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async addOrder(order: Partial<Order>): Promise<Order | null> {
    try {
      const response = await api.post('/transactions/orders', order);
      return response.data;
    } catch (error) {
      console.error('Error adding order:', error);
      return null;
    }
  }

  async updateOrder(order: Partial<Order>): Promise<Order | null> {
    try {
      const response = await api.put(`/transactions/orders/${order.id}`, order);
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      return null;
    }
  }

  // Tables
  async getTablesByRestaurant(restaurantId: string): Promise<Table[]> {
    try {
      const detail = await this.getRestaurantDetail(restaurantId);
      return detail?.tables || [];
    } catch (error) {
      console.error('Error fetching tables:', error);
      return [];
    }
  }
}

export const dataStore = new DataStore();
