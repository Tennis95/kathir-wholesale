'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('kathir-user');
    const savedToken = localStorage.getItem('kathir-token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Signup failed');
    }

    const data = await res.json();
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('kathir-user', JSON.stringify(data.user));
    localStorage.setItem('kathir-token', data.token);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await res.json();
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('kathir-user', JSON.stringify(data.user));
    localStorage.setItem('kathir-token', data.token);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setToken(null);
    localStorage.removeItem('kathir-user');
    localStorage.removeItem('kathir-token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        signup,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
