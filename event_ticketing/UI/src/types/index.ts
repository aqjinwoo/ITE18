// Shared types for the application

export type Page = 
  | 'landing'
  | 'login' 
  | 'register' 
  | 'admin-dashboard'
  | 'events'
  | 'create-event'
  | 'edit-event'
  | 'event-details'
  | 'ticket-purchase'
  | 'payment'
  | 'venues'
  | 'categories'
  | 'orders'
  | 'user-dashboard'
  | 'settings';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  venue_id: number;
  venue_name: string;
  venue_location: string;
  category_id: number;
  category_name: string;
  image: string;
  price: number;
  available_tickets: number;
  total_tickets: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface User {
  id?: number;
  user_id?: number;
  admin_id?: number;
  name?: string;
  username?: string;
  admin_name?: string;
  email: string;
  role: 'admin' | 'user';
}

