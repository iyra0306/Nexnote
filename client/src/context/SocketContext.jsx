import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

// Derive socket URL from API URL - strip /api suffix
const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect socket
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      if (user?._id) socket.emit('joinRoom', user._id);
      if (user?.department) socket.emit('joinDepartment', user.department);
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('onlineUsers', (count) => setOnlineUsers(count));

    socket.on('newNote', (data) => {
      setNotifications((prev) => [
        { id: Date.now(), type: 'note', ...data, read: false },
        ...prev.slice(0, 9),
      ]);
    });

    socket.on('newAnnouncement', (data) => {
      setNotifications((prev) => [
        { id: Date.now(), type: 'announcement', ...data, read: false },
        ...prev.slice(0, 9),
      ]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id, user?.department]);  // reconnect if user changes

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearNotifications = () => setNotifications([]);

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      onlineUsers,
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      connected,
      markAllRead,
      clearNotifications,
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
};
