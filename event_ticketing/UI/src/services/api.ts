// API Service Layer for Event Ticketing System
// Base URL: http://127.0.0.1:8000/api/v1

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
const BACKEND_URL = 'http://127.0.0.1:8000';

// Helper function to get full image URL
const getFullImageUrl = (imageUrl: string | null | undefined): string => {
  const defaultImage = 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800';
  
  if (!imageUrl) return defaultImage;
  
  // If it's already a full URL (http/https), return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a local path (starts with /), prepend backend URL
  if (imageUrl.startsWith('/')) {
    return `${BACKEND_URL}${imageUrl}`;
  }
  
  return defaultImage;
};

// Get auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Get auth headers
const getAuthHeaders = (includeContentType: boolean = true): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API Response type
interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  user?: T;
  token?: string;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Check if body is FormData - don't set Content-Type header (browser sets it with boundary)
  const isFormData = options.body instanceof FormData;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(!isFormData),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// ==================== AUTHENTICATION ====================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  user_id?: number;
  admin_id?: number;
  username?: string;
  admin_name?: string;
  name?: string;
  email: string;
  role: 'admin' | 'user';
  token?: string;
}

export const authApi = {
  // User registration
  register: async (data: RegisterData): Promise<ApiResponse<User>> => {
    const response = await apiRequest<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  // User login
  login: async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    const response = await apiRequest<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Handle different response structures
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    } else if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  },

  // Admin login
  adminLogin: async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    const response = await apiRequest<any>('/admin-auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Admin API returns: { success, message, data: { admin, token } }
    // Extract token from nested structure
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  },

  // User logout
  logout: async (): Promise<void> => {
    try {
      await apiRequest('/users/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  // Admin logout
  adminLogout: async (): Promise<void> => {
    try {
      await apiRequest('/admin/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiRequest<User>('/users/me');
  },

  // Get admin profile
  getAdminProfile: async (): Promise<ApiResponse<User>> => {
    return apiRequest<User>('/admin/profile');
  },
};

// ==================== EVENTS ====================

export interface Event {
  event_id?: number;
  id?: number;
  event_name?: string;
  title?: string;
  description?: string;
  event_date?: string;
  date?: string;
  event_time?: string;
  time?: string;
  venue_id?: number;
  venue?: {
    venue_id: number;
    venue_name: string;
    address: string;
    capacity: number;
  };
  venue_name?: string;
  venue_location?: string;
  category_id?: number;
  category?: {
    category_id: number;
    category_name: string;
  };
  category_name?: string;
  image?: string;
  price?: number;
  available_tickets?: number;
  total_tickets?: number;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  admin_id?: number;
}

// Transform backend event to frontend format
const transformEvent = (backendEvent: any): Event => {
  return {
    id: backendEvent.event_id || backendEvent.id,
    title: backendEvent.event_name || backendEvent.title,
    description: backendEvent.description || '',
    date: backendEvent.event_date || backendEvent.date,
    time: backendEvent.event_time || backendEvent.time || '00:00',
    venue_id: backendEvent.venue_id || backendEvent.venue?.venue_id,
    venue_name: backendEvent.venue?.venue_name || backendEvent.venue_name,
    venue_location: backendEvent.venue?.address || backendEvent.venue_location,
    category_id: backendEvent.category_id || backendEvent.category?.category_id,
    category_name: backendEvent.category?.category_name || backendEvent.category_name,
    image: getFullImageUrl(backendEvent.image_url || backendEvent.image),
    price: parseFloat(backendEvent.base_price) || backendEvent.price || 0,
    available_tickets: backendEvent.available_tickets || (backendEvent.total_tickets || 0),
    total_tickets: backendEvent.total_tickets || 0,
    status: backendEvent.status || 'upcoming',
  };
};

export const eventsApi = {
  // Get all events (public)
  getEvents: async (params?: { include_past?: boolean; search?: string; category?: string }): Promise<Event[]> => {
    let endpoint = '/events';
    const queryParams = new URLSearchParams();
    
    if (params?.include_past) {
      queryParams.append('include_past', 'true');
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.category) {
      queryParams.append('category', params.category);
    }
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }
    
    console.log('[API] Fetching events from:', endpoint);
    const response = await apiRequest<{ data: any[] }>(endpoint);
    console.log('[API] Raw response:', response);
    const responseData = response.data as { data?: any[] } | undefined;
    const events: any[] = responseData?.data || [];
    console.log('[API] Extracted events array:', events);
    const transformed = events.map(transformEvent);
    console.log('[API] Transformed events:', transformed);
    return transformed;
  },

  // Get event by ID (public)
  getEvent: async (id: number): Promise<Event> => {
    const response = await apiRequest<{ data: any }>(`/events/${id}`);
    return transformEvent(response.data);
  },

  // Create event (admin)
  createEvent: async (data: {
    event_name: string;
    description?: string;
    event_date: string;
    event_time?: string;
    venue_id: number;
    category_id: number;
    total_tickets?: number;
    price?: number;
    image?: File | null;
    image_url?: string;
    status?: string;
  }): Promise<Event> => {
    // Use FormData if there's a file upload
    if (data.image instanceof File) {
      const formData = new FormData();
      formData.append('event_name', data.event_name);
      if (data.description) formData.append('description', data.description);
      formData.append('event_date', data.event_date);
      if (data.event_time) formData.append('event_time', data.event_time);
      formData.append('venue_id', data.venue_id.toString());
      formData.append('category_id', data.category_id.toString());
      if (data.total_tickets) formData.append('total_tickets', data.total_tickets.toString());
      if (data.price) formData.append('base_price', data.price.toString());
      formData.append('image', data.image);
      if (data.status) formData.append('status', data.status);

      const response = await apiRequest<{ data: any }>('/admin/events', {
        method: 'POST',
        body: formData,
      });
      return transformEvent(response.data);
    }
    
    // Use JSON if no file (URL or no image)
    const jsonData: any = {
      event_name: data.event_name,
      description: data.description,
      event_date: data.event_date,
      event_time: data.event_time,
      venue_id: data.venue_id,
      category_id: data.category_id,
      total_tickets: data.total_tickets,
      base_price: data.price,
      status: data.status,
    };
    if (data.image_url) jsonData.image_url = data.image_url;
    
    const response = await apiRequest<{ data: any }>('/admin/events', {
      method: 'POST',
      body: JSON.stringify(jsonData),
    });
    return transformEvent(response.data);
  },

  // Update event (admin)
  updateEvent: async (id: number, data: {
    event_name?: string;
    description?: string;
    event_date?: string;
    event_time?: string;
    venue_id?: number;
    category_id?: number;
    total_tickets?: number;
    price?: number;
    image?: File | null;
    image_url?: string;
    status?: string;
  }): Promise<Event> => {
    // Use FormData if there's a file upload
    if (data.image instanceof File) {
      const formData = new FormData();
      if (data.event_name) formData.append('event_name', data.event_name);
      if (data.description) formData.append('description', data.description);
      if (data.event_date) formData.append('event_date', data.event_date);
      if (data.event_time) formData.append('event_time', data.event_time);
      if (data.venue_id) formData.append('venue_id', data.venue_id.toString());
      if (data.category_id) formData.append('category_id', data.category_id.toString());
      if (data.total_tickets) formData.append('total_tickets', data.total_tickets.toString());
      if (data.price) formData.append('base_price', data.price.toString());
      formData.append('image', data.image);
      if (data.status) formData.append('status', data.status);
      // For PUT with FormData, we need to use POST with _method override
      formData.append('_method', 'PUT');

      const response = await apiRequest<{ data: any }>(`/admin/events/${id}`, {
        method: 'POST',
        body: formData,
      });
      return transformEvent(response.data);
    }
    
    // Use JSON if no file
    const jsonData: any = {};
    if (data.event_name) jsonData.event_name = data.event_name;
    if (data.description) jsonData.description = data.description;
    if (data.event_date) jsonData.event_date = data.event_date;
    if (data.event_time) jsonData.event_time = data.event_time;
    if (data.venue_id) jsonData.venue_id = data.venue_id;
    if (data.category_id) jsonData.category_id = data.category_id;
    if (data.total_tickets) jsonData.total_tickets = data.total_tickets;
    if (data.price) jsonData.base_price = data.price;
    if (data.image_url) jsonData.image_url = data.image_url;
    if (data.status) jsonData.status = data.status;
    
    const response = await apiRequest<{ data: any }>(`/admin/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jsonData),
    });
    return transformEvent(response.data);
  },

  // Delete event (admin)
  deleteEvent: async (id: number): Promise<void> => {
    await apiRequest(`/admin/events/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== CATEGORIES ====================

export interface Category {
  category_id?: number;
  id?: number;
  category_name?: string;
  name?: string;
  description?: string;
  icon?: string;
}

export const categoriesApi = {
  // Get all categories (public)
  getCategories: async (): Promise<Category[]> => {
    const response = await apiRequest<any[]>('/categories');
    const categories: any[] = response.data || [];
    return categories.map(cat => ({
      id: cat.category_id || cat.id,
      name: cat.category_name || cat.name,
      description: cat.description || '',
      icon: cat.icon || 'tag',
    }));
  },

  // Create category (admin)
  createCategory: async (data: { category_name: string; description?: string; icon?: string }): Promise<Category> => {
    const response = await apiRequest<any>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const categoryData = response.data;
    return {
      id: categoryData?.category_id,
      name: categoryData?.category_name,
      description: categoryData?.description,
      icon: categoryData?.icon || 'tag',
    };
  },

  // Update category (admin)
  updateCategory: async (id: number, data: { category_name: string; description?: string; icon?: string }): Promise<Category> => {
    const response = await apiRequest<any>(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    const categoryData = response.data;
    return {
      id: categoryData?.category_id,
      name: categoryData?.category_name,
      description: categoryData?.description,
      icon: categoryData?.icon || 'tag',
    };
  },

  // Delete category (admin)
  deleteCategory: async (id: number): Promise<void> => {
    await apiRequest(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== VENUES ====================

export interface Venue {
  venue_id?: number;
  id?: number;
  venue_name?: string;
  name?: string;
  address?: string;
  city?: string;
  capacity?: number;
  description?: string;
}

export const venuesApi = {
  // Get all venues (public)
  getVenues: async (): Promise<Venue[]> => {
    const response = await apiRequest<any[]>('/venues');
    const venues: any[] = response.data || [];
    return venues.map(venue => ({
      id: venue.venue_id || venue.id,
      name: venue.venue_name || venue.name,
      address: venue.address || '',
      city: venue.city || '',
      capacity: venue.capacity || 0,
      description: venue.description || '',
    }));
  },

  // Create venue (admin)
  createVenue: async (data: {
    venue_name: string;
    address: string;
    capacity: number;
    city?: string;
    description?: string;
  }): Promise<Venue> => {
    const response = await apiRequest<any>('/admin/venues', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const venueData = response.data;
    return {
      id: venueData?.venue_id,
      name: venueData?.venue_name,
      address: venueData?.address,
      city: venueData?.city,
      capacity: venueData?.capacity,
      description: venueData?.description,
    };
  },

  // Update venue (admin)
  updateVenue: async (id: number, data: Partial<Venue>): Promise<Venue> => {
    const response = await apiRequest<any>(`/admin/venues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    const venueData = response.data;
    return {
      id: venueData?.venue_id,
      name: venueData?.venue_name,
      address: venueData?.address,
      city: venueData?.city,
      capacity: venueData?.capacity,
      description: venueData?.description,
    };
  },

  // Delete venue (admin)
  deleteVenue: async (id: number): Promise<void> => {
    await apiRequest(`/admin/venues/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== TICKETS ====================

export interface Ticket {
  ticket_id?: number;
  id?: number;
  user_id?: number;
  event_id?: number;
  purchase_date?: string;
  event?: Event;
  payment?: Payment;
}

export const ticketsApi = {
  // Get user's tickets
  getTickets: async (): Promise<Ticket[]> => {
    const response = await apiRequest<{ data: any[] }>('/tickets');
    const responseData = response.data as { data?: any[] } | undefined;
    const tickets: any[] = responseData?.data || [];
    return tickets.map(ticket => ({
      id: ticket.ticket_id || ticket.id,
      user_id: ticket.user_id,
      event_id: ticket.event_id,
      purchase_date: ticket.purchase_date,
      event: ticket.event ? transformEvent(ticket.event) : undefined,
      payment: ticket.payment,
    }));
  },

  // Purchase ticket
  purchaseTicket: async (data: { event_id: number }): Promise<Ticket> => {
    const response = await apiRequest<any>('/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const ticketData = response.data;
    return {
      id: ticketData?.ticket_id,
      user_id: ticketData?.user_id,
      event_id: ticketData?.event_id,
      purchase_date: ticketData?.purchase_date,
      event: ticketData?.event ? transformEvent(ticketData.event) : undefined,
    };
  },

  // Get ticket by ID
  getTicket: async (id: number): Promise<Ticket> => {
    const response = await apiRequest<any>(`/tickets/${id}`);
    const ticketData = response.data;
    return {
      id: ticketData?.ticket_id,
      user_id: ticketData?.user_id,
      event_id: ticketData?.event_id,
      purchase_date: ticketData?.purchase_date,
      event: ticketData?.event ? transformEvent(ticketData.event) : undefined,
      payment: ticketData?.payment,
    };
  },

  // Cancel ticket
  cancelTicket: async (id: number): Promise<void> => {
    await apiRequest(`/tickets/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== PAYMENTS ====================

export interface Payment {
  payment_id?: number;
  id?: number;
  ticket_id?: number;
  amount: number;
  payment_method: string;
  payment_date?: string;
  status?: string;
  ticket?: Ticket;
}

export const paymentsApi = {
  // Get user's payments
  getPayments: async (): Promise<Payment[]> => {
    const response = await apiRequest<any[]>('/payments');
    const payments: any[] = response.data || [];
    return payments.map(payment => ({
      id: payment.payment_id || payment.id,
      ticket_id: payment.ticket_id,
      amount: parseFloat(payment.amount) || 0,
      payment_method: payment.payment_method || '',
      payment_date: payment.payment_date,
      status: payment.status || 'completed',
      ticket: payment.ticket,
    }));
  },

  // Create payment
  createPayment: async (data: {
    ticket_id: number;
    amount: number;
    payment_method: string;
  }): Promise<Payment> => {
    const response = await apiRequest<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const paymentData = response.data;
    return {
      id: paymentData?.payment_id,
      ticket_id: paymentData?.ticket_id,
      amount: parseFloat(paymentData?.amount) || 0,
      payment_method: paymentData?.payment_method || '',
      payment_date: paymentData?.payment_date,
      status: paymentData?.status || 'completed',
    };
  },

  // Get payment by ID
  getPayment: async (id: number): Promise<Payment> => {
    const response = await apiRequest<any>(`/payments/${id}`);
    const paymentData = response.data;
    return {
      id: paymentData?.payment_id,
      ticket_id: paymentData?.ticket_id,
      amount: parseFloat(paymentData?.amount) || 0,
      payment_method: paymentData?.payment_method || '',
      payment_date: paymentData?.payment_date,
      status: paymentData?.status || 'completed',
    };
  },
};

// ==================== ADMIN PAYMENTS/ORDERS ====================

export const adminPaymentsApi = {
  // Get all payments (admin)
  getPayments: async (params?: { status?: string; payment_method?: string; search?: string }): Promise<{ data: Payment[]; total?: number; paid?: number; pending?: number; revenue?: number }> => {
    let endpoint = '/admin/payments';
    const queryParams = new URLSearchParams();
    
    if (params?.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }
    if (params?.payment_method && params.payment_method !== 'all') {
      queryParams.append('payment_method', params.payment_method);
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }
    
    const response = await apiRequest<{ data: any[] | { data?: any[]; total?: number; current_page?: number; last_page?: number } }>(endpoint);
    
    // Handle Laravel paginated response - data.data contains the actual items array
    let payments: any[] = [];
    let totalCount = 0;
    if (response.data) {
      if (Array.isArray(response.data)) {
        // Direct array response
        payments = response.data;
        totalCount = payments.length;
      } else {
        // Paginated response - items are in data.data
        const paginatedData = response.data as { data?: any[]; total?: number; current_page?: number; last_page?: number };
        if (paginatedData.data && Array.isArray(paginatedData.data)) {
          payments = paginatedData.data;
          totalCount = paginatedData.total || payments.length;
        }
      }
    }
    
    // Calculate stats from payments
    const stats = {
      total: totalCount,
      paid: payments.filter((p: any) => p.status === 'completed' || p.status === 'paid').length,
      pending: payments.filter((p: any) => p.status === 'pending').length,
      revenue: payments
        .filter((p: any) => p.status === 'completed' || p.status === 'paid')
        .reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0),
    };
    
    return {
      data: payments.map(payment => ({
        id: payment.payment_id || payment.id,
        ticket_id: payment.ticket_id,
        amount: parseFloat(payment.amount) || 0,
        payment_method: payment.payment_method || '',
        payment_date: payment.payment_date || payment.created_at,
        status: payment.status || 'completed',
        ticket: payment.ticket ? {
          id: payment.ticket.ticket_id || payment.ticket.id,
          user_id: payment.ticket.user_id,
          event_id: payment.ticket.event_id,
          purchase_date: payment.ticket.purchase_date,
          event: payment.ticket.event ? transformEvent(payment.ticket.event) : undefined,
          user: payment.ticket.user,
        } : undefined,
      })),
      total: stats.total,
      paid: stats.paid,
      pending: stats.pending,
      revenue: stats.revenue,
    };
  },

  // Get payment by ID (admin)
  getPayment: async (id: number): Promise<Payment> => {
    const response = await apiRequest<any>(`/admin/payments/${id}`);
    const paymentData = response.data;
    return {
      id: paymentData?.payment_id,
      ticket_id: paymentData?.ticket_id,
      amount: parseFloat(paymentData?.amount) || 0,
      payment_method: paymentData?.payment_method || '',
      payment_date: paymentData?.payment_date,
      status: paymentData?.status || 'completed',
      ticket: paymentData?.ticket,
    };
  },

  // Update payment status (admin)
  updatePayment: async (id: number, status: string): Promise<Payment> => {
    const response = await apiRequest<any>(`/admin/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    const paymentData = response.data;
    return {
      id: paymentData?.payment_id,
      ticket_id: paymentData?.ticket_id,
      amount: parseFloat(paymentData?.amount) || 0,
      payment_method: paymentData?.payment_method || '',
      payment_date: paymentData?.payment_date,
      status: paymentData?.status || 'completed',
      ticket: paymentData?.ticket,
    };
  },
};

// ==================== USER PROFILE ====================

export interface UserProfile {
  user_id?: number;
  admin_id?: number;
  username?: string;
  admin_name?: string;
  name?: string;
  email: string;
  phone?: string;
}

export const userApi = {
  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiRequest<any>('/users/profile');
    const userData = response.data;
    return {
      user_id: userData?.user_id,
      username: userData?.username,
      name: userData?.username,
      email: userData?.email,
    };
  },

  // Update user profile
  updateProfile: async (data: {
    username?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
  }): Promise<UserProfile> => {
    const response = await apiRequest<any>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    const userData = response.data;
    return {
      user_id: userData?.user_id,
      username: userData?.username,
      name: userData?.username,
      email: userData?.email,
    };
  },
};

// ==================== ADMIN DASHBOARD ====================

export interface DashboardStats {
  total_events?: number;
  total_users?: number;
  total_tickets?: number;
  total_revenue?: number;
  active_events?: number;
  upcoming_events?: number;
  past_events?: number;
}

export const dashboardApi = {
  // Get dashboard stats
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiRequest<any>('/admin/dashboard/stats');
    return response.data || {};
  },

  // Get reports
  getReports: async (): Promise<any> => {
    const response = await apiRequest('/admin/dashboard/reports');
    return response.data || {};
  },

  // Get analytics
  getAnalytics: async (): Promise<any> => {
    const response = await apiRequest('/admin/dashboard/analytics');
    return response.data || {};
  },
};

