'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin' | 'manager' | 'finance';
  isAdmin: boolean;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  setAdminAuth: (user: AdminUser | null, token: string | null) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUserState] = useState<AdminUser | null>(null);
  const [adminToken, setAdminTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (typeof window === 'undefined') {
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }

        const savedUser = localStorage.getItem('kathir-admin-user');
        const savedToken = localStorage.getItem('kathir-admin-token');

        if (savedUser && savedToken) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setAdminUserState(parsedUser);
            setAdminTokenState(savedToken);
          } catch (error) {
            console.error('Failed to parse admin user:', error);
            localStorage.removeItem('kathir-admin-user');
            localStorage.removeItem('kathir-admin-token');
            setAdminUserState(null);
            setAdminTokenState(null);
          }
        } else {
          setAdminUserState(null);
          setAdminTokenState(null);
        }
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const setAdminAuth = (user: AdminUser | null, token: string | null) => {
    setAdminUserState(user);
    setAdminTokenState(token);

    if (user && token) {
      localStorage.setItem('kathir-admin-user', JSON.stringify(user));
      localStorage.setItem('kathir-admin-token', token);
    } else {
      localStorage.removeItem('kathir-admin-user');
      localStorage.removeItem('kathir-admin-token');
    }
  };

  const logout = () => {
    setAdminUserState(null);
    setAdminTokenState(null);
    localStorage.removeItem('kathir-admin-user');
    localStorage.removeItem('kathir-admin-token');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        adminToken,
        isAdminAuthenticated: !!adminUser && !!adminToken,
        isLoading: !isInitialized,
        logout,
        setAdminAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
