import axios from 'axios';
import type { AuthResponse, RegisterData, LoginData, User, Event, EventFilters } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Events API
export const eventsApi = {
  getAll: async (filters?: EventFilters): Promise<Event[]> => {
    const response = await api.get('/events', { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  create: async (data: Partial<Event>): Promise<Event> => {
    const response = await api.post('/events', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Event>): Promise<Event> => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}`);
  },

  register: async (id: number): Promise<void> => {
    await api.post(`/events/${id}/register`);
  },

  unregister: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}/register`);
  },

  getMyEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events/user/my-events');
    return response.data;
  },
};

export default api;
