'use client';

import { createContext, useContext, useState, useEffect } from 'react';

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
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('kathir-admin-user');
    const savedToken = localStorage.getItem('kathir-admin-token');

    if (savedUser && savedToken) {
      try {
        setAdminUser(JSON.parse(savedUser));
        setAdminToken(savedToken);
      } catch (error) {
        console.error('Failed to parse admin user:', error);
        localStorage.removeItem('kathir-admin-user');
        localStorage.removeItem('kathir-admin-token');
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    setAdminUser(null);
    setAdminToken(null);
    localStorage.removeItem('kathir-admin-user');
    localStorage.removeItem('kathir-admin-token');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        adminToken,
        isAdminAuthenticated: !!adminUser,
        isLoading,
        logout,
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
