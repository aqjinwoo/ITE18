'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, isAdmin: boolean) => Promise<void>;
  register: (username: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Try to get user profile
      try {
        const response = await authApi.getCurrentUser();
        // User API returns: { success: true, data: {...} }
        if (response.data) {
          setUser({
            ...response.data,
            role: 'user',
          });
        } else if (response.user) {
          // Fallback for old format
          setUser({
            ...response.user,
            role: 'user',
          });
        }
      } catch (error) {
        // If user endpoint fails, try admin endpoint
        try {
          const response = await authApi.getAdminProfile();
          // Admin API returns: { success, data: {...} }
          if (response.data) {
            setUser({
              ...response.data,
              role: 'admin',
            });
          }
        } catch (adminError) {
          // Both failed, clear token
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, isAdmin: boolean = false) => {
    try {
      let response;
      if (isAdmin) {
        response = await authApi.adminLogin({ email, password });
        // Admin login returns: { success, message, data: { admin, token } }
        const responseData = response.data as { admin?: any; token?: string } | undefined;
        if (responseData && responseData.admin) {
          const admin = responseData.admin;
          // Store token if available
          if (responseData.token) {
            localStorage.setItem('auth_token', responseData.token);
          }
          setUser({
            ...admin,
            role: 'admin',
          });
        } else {
          throw new Error('Invalid admin login response');
        }
      } else {
        response = await authApi.login({ email, password });
        // User login returns: { success: true, message: '...', data: { user, token } }
        const responseData = response.data as { user?: any; token?: string } | undefined;
        if (responseData && responseData.user) {
          const user = responseData.user;
          // Store token if available
          if (responseData.token) {
            localStorage.setItem('auth_token', responseData.token);
          }
          setUser({
            ...user,
            role: 'user',
          });
        } else if (response.user) {
          // Fallback for old format: { user, token }
          if (response.token) {
            localStorage.setItem('auth_token', response.token);
          }
          setUser({
            ...response.user,
            role: 'user',
          });
        } else {
          throw new Error('Invalid login response');
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    }
  };

  const register = async (username: string, email: string, password: string, passwordConfirmation: string) => {
    try {
      const response = await authApi.register({
        username,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      
      // Register returns: { success: true, message: '...', data: { user, token } }
      const responseData = response.data as { user?: any; token?: string } | undefined;
      if (responseData && responseData.user) {
        const user = responseData.user;
        // Store token if available
        if (responseData.token) {
          localStorage.setItem('auth_token', responseData.token);
        }
        setUser({
          ...user,
          role: 'user',
        });
      } else if (response.user) {
        // Fallback for old format: { user, token }
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        setUser({
          ...response.user,
          role: 'user',
        });
      } else {
        throw new Error('Invalid registration response');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      if (user?.role === 'admin') {
        await authApi.adminLogout();
      } else {
        await authApi.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
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

