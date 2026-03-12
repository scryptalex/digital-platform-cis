import axios from 'axios';
import type { AuthResponse, RegisterData, LoginData, User, Event, EventFilters } from '../types';

// Determine API URL based on environment
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Production fallback
  if (window.location.hostname === 'digital-platform-cis.vercel.app') {
    return 'https://digital-platform-cis-production-a20c.up.railway.app/api';
  }
  return 'http://localhost:3001/api';
};

const API_URL = getApiUrl();

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

// Discussions types
export interface Discussion {
  id: number;
  title: string;
  content: string;
  category: string;
  author_id: number;
  author_name: string;
  author_org?: string;
  views_count: number;
  replies_count: number;
  is_pinned: boolean;
  created_at: string;
  replies?: DiscussionReply[];
}

export interface DiscussionReply {
  id: number;
  discussion_id: number;
  author_id: number;
  author_name: string;
  content: string;
  created_at: string;
}

// Business project types
export interface BusinessProject {
  id: number;
  title: string;
  description: string;
  sector: string;
  investment_required: string;
  investment_currency: string;
  country: string;
  contact_email?: string;
  contact_phone?: string;
  company_name: string;
  author_id: number;
  author_name: string;
  views_count: number;
  status: string;
  created_at: string;
}

// Discussions API
export const discussionsApi = {
  getAll: async (category?: string): Promise<Discussion[]> => {
    const response = await api.get('/discussions', { params: { category } });
    return response.data;
  },

  getById: async (id: number): Promise<Discussion> => {
    const response = await api.get(`/discussions/${id}`);
    return response.data;
  },

  create: async (data: { title: string; content: string; category: string }): Promise<Discussion> => {
    const response = await api.post('/discussions', data);
    return response.data;
  },

  addReply: async (id: number, content: string): Promise<DiscussionReply> => {
    const response = await api.post(`/discussions/${id}/reply`, { content });
    return response.data;
  },
};

// Business projects API
export const businessApi = {
  getAll: async (filters?: { sector?: string; country?: string }): Promise<BusinessProject[]> => {
    const response = await api.get('/business', { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<BusinessProject> => {
    const response = await api.get(`/business/${id}`);
    return response.data;
  },

  create: async (data: Partial<BusinessProject>): Promise<BusinessProject> => {
    const response = await api.post('/business', data);
    return response.data;
  },

  update: async (id: number, data: Partial<BusinessProject>): Promise<BusinessProject> => {
    const response = await api.put(`/business/${id}`, data);
    return response.data;
  },
};

export default api;
