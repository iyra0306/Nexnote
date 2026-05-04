import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5001/api';

const getTokenExpiry = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000;
  } catch { return null; }
};

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('nexnote_user');
    const token  = localStorage.getItem('token');
    if (stored && token) {
      const expiry = getTokenExpiry(token);
      if (expiry && Date.now() > expiry) {
        localStorage.removeItem('nexnote_user');
        localStorage.removeItem('token');
      } else {
        try { setUser(JSON.parse(stored)); }
        catch { localStorage.removeItem('nexnote_user'); }
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('nexnote_user', JSON.stringify(userData));
    if (userData.token) localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexnote_user');
    localStorage.removeItem('token');
  };

  const updateUser = (userData) => {
    setUser(prev => {
      const updated = { ...prev, ...userData };
      localStorage.setItem('nexnote_user', JSON.stringify(updated));
      return updated;
    });
  };

  // Update points immediately in UI - uses functional update to avoid stale closure
  const syncPoints = (newPoints) => {
    if (typeof newPoints !== 'number') return;
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, points: newPoints };
      localStorage.setItem('nexnote_user', JSON.stringify(updated));
      return updated;
    });
  };

  // Fetch fresh user data from server (latest points, badges etc)
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const { data } = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(prev => {
        const updated = { ...prev, ...data, token: prev?.token };
        localStorage.setItem('nexnote_user', JSON.stringify(updated));
        return updated;
      });
    } catch { /* silent */ }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, syncPoints, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
