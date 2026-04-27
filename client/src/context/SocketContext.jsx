import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to socket server
    socketRef.current = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);

      // Join personal room
      if (user?._id) socket.emit('joinRoom', user._id);

      // Join department room
      if (user?.department) socket.emit('joinDepartment', user.department);
    });

    // Online users count
    socket.on('onlineUsers', (count) => setOnlineUsers(count));

    // New note uploaded notification
    socket.on('newNote', (data) => {
      setNotifications((prev) => [
        { id: Date.now(), type: 'note', ...data, read: false },
        ...prev.slice(0, 9), // keep last 10
      ]);
    });

    // New announcement notification
    socket.on('newAnnouncement', (data) => {
      setNotifications((prev) => [
        { id: Date.now(), type: 'announcement', ...data, read: false },
        ...prev.slice(0, 9),
      ]);
    });

    // Live note count update
    socket.on('noteUploaded', (data) => {
      // Trigger re-fetch in components listening
      socket.emit('refreshNotes', data);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => setNotifications([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      onlineUsers,
      notifications,
      unreadCount,
      markAllRead,
      clearNotifications,
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
