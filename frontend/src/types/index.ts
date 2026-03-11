export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  organization?: string;
  country?: string;
  created_at?: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  event_type: string;
  start_date: string;
  end_date: string;
  location?: string;
  is_online: boolean;
  online_link?: string;
  organizer_id: number;
  organizer_name?: string;
  organizer_org?: string;
  country?: string;
  max_participants?: number;
  registered_count?: number;
  image_url?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  organization?: string;
  country?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface EventFilters {
  country?: string;
  event_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}
