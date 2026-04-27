import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Decode JWT payload without verifying (client-side only for expiry check)
const getTokenExpiry = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // convert to ms
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('nexnote_user');
    const token = localStorage.getItem('token');
    if (stored && token) {
      // Check if token is expired
      const expiry = getTokenExpiry(token);
      if (expiry && Date.now() > expiry) {
        // Token expired - clear storage
        localStorage.removeItem('nexnote_user');
        localStorage.removeItem('token');
      } else {
        try {
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem('nexnote_user');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const { token, ...userInfo } = userData;
    setUser(userData);
    localStorage.setItem('nexnote_user', JSON.stringify(userData));
    if (token) localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexnote_user');
    localStorage.removeItem('token');
  };

  const updateUser = (userData) => {
    const updated = { ...user, ...userData };
    setUser(updated);
    localStorage.setItem('nexnote_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
