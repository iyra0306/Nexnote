import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineCloudArrowUp,
  HiOutlineDocumentText,
  HiOutlineHeart,
  HiOutlineChartBar,
  HiOutlineInformationCircle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUser,
  HiBars3,
  HiXMark,
  HiOutlineMegaphone,
  HiOutlineEnvelope,
  HiOutlineBell,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome, roles: ['student', 'teacher', 'admin'] },
  { path: '/upload', label: 'Upload Notes', icon: HiOutlineCloudArrowUp, roles: ['teacher', 'admin'] },
  { path: '/notes', label: 'View Notes', icon: HiOutlineDocumentText, roles: ['student', 'teacher', 'admin'] },
  { path: '/favorites', label: 'Favorites', icon: HiOutlineHeart, roles: ['student', 'teacher', 'admin'] },
  { path: '/analytics', label: 'Analytics', icon: HiOutlineChartBar, roles: ['teacher', 'admin'] },
  { path: '/announcements', label: 'Announcements', icon: HiOutlineMegaphone, roles: ['student', 'teacher', 'admin'] },
  { path: '/profile', label: 'Profile', icon: HiOutlineUser, roles: ['student', 'teacher', 'admin'] },
  { path: '/about', label: 'About', icon: HiOutlineInformationCircle, roles: ['student', 'teacher', 'admin'] },
  { path: '/contact', label: 'Contact', icon: HiOutlineEnvelope, roles: ['student', 'teacher', 'admin'] },
];

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { onlineUsers, notifications, unreadCount, markAllRead } = useSocket();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:relative z-50 w-64 border-r border-white/5 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] backdrop-blur-xl shadow-[0_0_60px_rgba(99,102,241,0.2)] flex flex-col h-screen transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between gap-3 px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img 
              src="/nexnote-logo.png" 
              alt="NEXNOTE Logo" 
              className="h-12 w-auto object-contain rounded-lg"
              onError={(e) => {
                // Fallback to icon if image doesn't load
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="hidden relative h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_30px_rgba(99,102,241,0.8)] animate-pulse">
              <span className="text-2xl font-black text-white">N</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <HiXMark className="text-xl text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.filter(item => item.roles.includes(user?.role || 'student')).map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/10 text-indigo-300 shadow-[0_0_30px_rgba(99,102,241,0.4)] border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                <span
                  className={`absolute inset-y-1 left-1 w-1 rounded-full bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400 transition-transform ${
                    active ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-75'
                  }`}
                />
                <Icon className="relative z-10 text-lg" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/5">
          <div className="mb-2 rounded-xl bg-white/5 px-4 py-3 backdrop-blur">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="truncate text-sm font-medium text-slate-100">
              {user?.name || user?.email || 'Teacher'}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400">{onlineUsers} online now</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-gradient-to-r from-red-500/10 to-pink-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition-all hover:border-red-400/60 hover:from-red-500/20 hover:to-pink-500/20 hover:text-red-200"
          >
            <HiOutlineArrowRightOnRectangle className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content with top navbar and animated page area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Background gradient + glow accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-pink-500/5 blur-3xl" />
        </div>

        <div className="relative flex h-full flex-col">
          {/* Top navbar */}
          <header className="sticky top-0 z-20 border-b border-white/5 bg-[#020617]/70 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 sm:px-8 py-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <HiBars3 className="text-2xl text-slate-400" />
              </button>
              <div className="space-y-0.5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Dashboard
                </p>
                <p className="text-sm text-slate-400">
                  Welcome back,{' '}
                  <span className="font-semibold text-slate-100">
                    {user?.name || user?.email?.split('@')[0] || 'Teacher'}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Online users indicator */}
                <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400">{onlineUsers} online</span>
                </div>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => { setShowNotifications(!showNotifications); markAllRead(); }}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <HiOutlineBell className="text-xl text-slate-300" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-white/10 bg-[#0f172a] shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                          <p className="text-sm font-semibold text-slate-100">Notifications</p>
                          <button onClick={() => setShowNotifications(false)}>
                            <HiXMark className="text-slate-400 hover:text-slate-200" />
                          </button>
                        </div>
                        <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-center text-xs text-slate-500">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                                <span className="text-lg mt-0.5">
                                  {n.type === 'note' ? '📚' : '📢'}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-slate-200 truncate">{n.title}</p>
                                  <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.8)]">
                  <span className="text-sm font-bold">
                    {(user?.name || user?.email || 'N')[0].toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Animated page content */}
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, x: 60, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 overflow-auto px-6 py-6 sm:px-8 sm:py-8"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  );
}
