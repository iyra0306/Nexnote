import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome, HiOutlineCloudArrowUp, HiOutlineDocumentText,
  HiOutlineHeart, HiOutlineChartBar, HiOutlineInformationCircle,
  HiOutlineArrowRightOnRectangle, HiOutlineUser, HiBars3, HiXMark,
  HiOutlineMegaphone, HiOutlineEnvelope, HiOutlineTrophy,
  HiOutlineFire, HiOutlineStar,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { AvatarDisplay } from './AvatarBuilder';
import NexusAI from './NexusAI';

const navItems = [
  { path: '/dashboard',     label: 'Home Base',     icon: HiOutlineHome,              roles: ['student','teacher','admin'], xp: '🏠' },
  { path: '/upload',        label: 'Upload Quest',  icon: HiOutlineCloudArrowUp,      roles: ['teacher','admin'],           xp: '⚔️' },
  { path: '/notes',         label: 'Note Library',  icon: HiOutlineDocumentText,      roles: ['student','teacher','admin'], xp: '📚' },
  { path: '/favorites',     label: 'Saved Loot',    icon: HiOutlineHeart,             roles: ['student','teacher','admin'], xp: '💎' },
  { path: '/analytics',     label: 'Stats Board',   icon: HiOutlineChartBar,          roles: ['teacher','admin'],           xp: '📊' },
  { path: '/announcements', label: 'Guild Chat',    icon: HiOutlineMegaphone,         roles: ['student','teacher','admin'], xp: '📣' },
  { path: '/profile',       label: 'My Character',  icon: HiOutlineUser,              roles: ['student','teacher','admin'], xp: '🧙' },
  { path: '/about',         label: 'About',         icon: HiOutlineInformationCircle, roles: ['student','teacher','admin'], xp: 'ℹ️' },
  { path: '/contact',       label: 'Contact',       icon: HiOutlineEnvelope,          roles: ['student','teacher','admin'], xp: '✉️' },
];

const RANK_LEVELS = [
  { min: 0,   label: 'Novice',    color: 'text-slate-400',  icon: '🌱' },
  { min: 50,  label: 'Scholar',   color: 'text-cyan-400',   icon: '📖' },
  { min: 150, label: 'Adept',     color: 'text-blue-400',   icon: '⚡' },
  { min: 300, label: 'Expert',    color: 'text-purple-400', icon: '🔮' },
  { min: 500, label: 'Master',    color: 'text-amber-400',  icon: '👑' },
  { min: 999, label: 'Legend',    color: 'text-rose-400',   icon: '🌟' },
];

function getRank(points = 0) {
  return [...RANK_LEVELS].reverse().find(r => points >= r.min) || RANK_LEVELS[0];
}

export default function Layout() {
  const location  = useLocation();
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarStr, setAvatarStr] = useState(() => localStorage.getItem('nexnote_avatar') || '');

  // Listen for avatar changes
  useEffect(() => {
    const handler = () => setAvatarStr(localStorage.getItem('nexnote_avatar') || '');
    window.addEventListener('storage', handler);
    // Also poll every 2s in case same-tab update
    const interval = setInterval(() => {
      const current = localStorage.getItem('nexnote_avatar') || '';
      setAvatarStr(prev => prev !== current ? current : prev);
    }, 2000);
    return () => { window.removeEventListener('storage', handler); clearInterval(interval); };
  }, []);

  const points = user?.points || 0;
  const rank   = getRank(points);
  const nextRank = RANK_LEVELS.find(r => r.min > points) || RANK_LEVELS[RANK_LEVELS.length - 1];
  const xpPct  = Math.min(100, Math.round((points / nextRank.min) * 100));

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex min-h-screen bg-[#0a0a1a] text-slate-100">

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <aside className={`fixed lg:relative z-50 w-64 flex flex-col h-screen transition-transform duration-300
        border-r border-amber-500/10 bg-gradient-to-b from-[#0d0d20] via-[#0f0f25] to-[#0d0d20]
        shadow-[4px_0_40px_rgba(245,158,11,0.08)]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-10 w-auto object-contain rounded-xl"
                onError={(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex'; }} />
              <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-gold">
                <span className="text-lg font-black text-white">N</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-black tracking-widest text-transparent bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text">NEXNOTE</p>
              <p className="text-[10px] text-amber-600/70 tracking-wider">STUDY RPG</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/5">
            <HiXMark className="text-xl text-slate-400" />
          </button>
        </div>

        {/* Player Card */}
        <div className="mx-3 mt-4 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-shrink-0">
              <AvatarDisplay
                avatarStr={avatarStr}
                name={user?.name || 'U'}
                size="md"
              />
              <span className="absolute -bottom-1 -right-1 text-sm">{rank.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-100 truncate">{user?.name || 'Player'}</p>
              <p className={`text-[10px] font-semibold ${rank.color}`}>{rank.label}</p>
            </div>
            <div className="ml-auto text-right flex-shrink-0">
              <p className="text-xs font-black text-amber-400">{points}</p>
              <p className="text-[10px] text-amber-600">XP</p>
            </div>
          </div>
          {/* XP Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>XP Progress</span>
              <span>{xpPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            </div>
            <p className="text-[10px] text-slate-600">Next: {nextRank.label} ({nextRank.min} XP)</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.filter(i => i.roles.includes(user?.role || 'student')).map((item) => {
            const Icon   = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                }`}>
                {active && (
                  <motion.span layoutId="nav-pill"
                    className="absolute inset-y-1 left-0 w-1 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
                )}
                <span className="text-base">{item.xp}</span>
                <Icon className="text-base flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {active && <HiOutlineFire className="text-amber-400 text-sm animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-amber-500/10 space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
            <HiOutlineTrophy className="text-amber-400 text-sm" />
            <span className="text-xs text-slate-400">Daily Streak</span>
            <span className="ml-auto text-xs font-bold text-amber-400">🔥 {user?.streak || 1}</span>
          </div>
          <button onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300">
            <HiOutlineArrowRightOnRectangle className="text-base" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="relative flex-1 overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-orange-500/3 blur-3xl" />
        </div>

        <div className="relative flex h-full flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-20 border-b border-amber-500/10 bg-[#0a0a1a]/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 sm:px-8 py-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/5">
                <HiBars3 className="text-2xl text-slate-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1">
                  <HiOutlineStar className="text-amber-400 text-xs" />
                  <span className="text-xs text-amber-400 font-semibold">{points} XP</span>
                </div>
                <div className={`hidden sm:flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1`}>
                  <span className="text-sm">{rank.icon}</span>
                  <span className={`text-xs font-bold ${rank.color}`}>{rank.label}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <AvatarDisplay
                    avatarStr={avatarStr}
                    name={user?.name || 'U'}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <motion.main key={location.pathname}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 overflow-auto px-4 py-6 sm:px-8 sm:py-8">
            <Outlet />
          </motion.main>
        </div>
      </div>

      {/* NEXUS AI - Floating on all pages */}
      <NexusAI />
    </div>
  );
}
