import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome, HiOutlineCloudArrowUp, HiOutlineDocumentText,
  HiOutlineHeart, HiOutlineChartBar, HiOutlineInformationCircle,
  HiOutlineArrowRightOnRectangle, HiOutlineUser, HiBars3, HiXMark,
  HiOutlineMegaphone, HiOutlineEnvelope, HiOutlineTrophy,
  HiOutlineFire, HiOutlineBolt,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { AvatarDisplay } from './AvatarBuilder';
import NexusAI from './NexusAI';

const navItems = [
  { path: '/dashboard',     label: 'Home Base',    icon: HiOutlineHome,              roles: ['student','teacher','admin'], color: '#00f5ff' },
  { path: '/upload',        label: 'Upload Quest', icon: HiOutlineCloudArrowUp,      roles: ['teacher','admin'],           color: '#ffd700' },
  { path: '/notes',         label: 'Note Library', icon: HiOutlineDocumentText,      roles: ['student','teacher','admin'], color: '#00ff88' },
  { path: '/favorites',     label: 'Saved Loot',   icon: HiOutlineHeart,             roles: ['student','teacher','admin'], color: '#ff0080' },
  { path: '/analytics',     label: 'Stats Board',  icon: HiOutlineChartBar,          roles: ['teacher','admin'],           color: '#bf00ff' },
  { path: '/announcements', label: 'Guild Chat',   icon: HiOutlineMegaphone,         roles: ['student','teacher','admin'], color: '#ff6b35' },
  { path: '/profile',       label: 'My Character', icon: HiOutlineUser,              roles: ['student','teacher','admin'], color: '#00f5ff' },
  { path: '/about',         label: 'About',        icon: HiOutlineInformationCircle, roles: ['student','teacher','admin'], color: '#94a3b8' },
  { path: '/contact',       label: 'Contact',      icon: HiOutlineEnvelope,          roles: ['student','teacher','admin'], color: '#94a3b8' },
];

const RANK_LEVELS = [
  { min: 0,   label: 'Novice',  icon: '🌱', color: '#94a3b8' },
  { min: 50,  label: 'Scholar', icon: '📖', color: '#00f5ff' },
  { min: 150, label: 'Adept',   icon: '⚡', color: '#bf00ff' },
  { min: 300, label: 'Expert',  icon: '🔮', color: '#ff0080' },
  { min: 500, label: 'Master',  icon: '👑', color: '#ffd700' },
  { min: 999, label: 'Legend',  icon: '🌟', color: '#ff6b35' },
];

function getRank(points = 0) {
  return [...RANK_LEVELS].reverse().find(r => points >= r.min) || RANK_LEVELS[0];
}

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarStr, setAvatarStr] = useState(() => localStorage.getItem('nexnote_avatar') || '');

  useEffect(() => {
    setAvatarStr(localStorage.getItem('nexnote_avatar') || '');
    const handler = () => setAvatarStr(localStorage.getItem('nexnote_avatar') || '');
    window.addEventListener('storage', handler);
    window.addEventListener('nexnote_avatar_changed', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('nexnote_avatar_changed', handler);
    };
  }, [user?._id]);

  const points  = user?.points || 0;
  const rank    = getRank(points);
  const nextRank = RANK_LEVELS.find(r => r.min > points) || RANK_LEVELS[RANK_LEVELS.length - 1];
  const xpPct   = Math.min(100, Math.round((points / nextRank.min) * 100));

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex min-h-screen text-slate-100" style={{ background: '#030308' }}>
      {/* Scan line */}
      <div className="scan-line" />

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <aside className={`fixed lg:relative z-50 w-64 flex flex-col h-screen transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: 'rgba(8,8,20,0.95)', borderRight: '1px solid rgba(0,245,255,0.08)', backdropFilter: 'blur(20px)' }}>

        {/* Top accent line */}
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #00f5ff, #bf00ff, transparent)' }} />

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: '1px solid rgba(0,245,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-10 w-auto object-contain rounded-xl"
              onError={(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex'; }} />
            <div className="hidden h-10 w-10 items-center justify-center rounded-xl font-black text-white text-lg"
              style={{ background: 'linear-gradient(135deg, #00f5ff, #bf00ff)' }}>N</div>
            <div>
              <p className="text-sm font-black tracking-widest gradient-text-cyber">NEXNOTE</p>
              <p className="text-[9px] tracking-[0.3em] font-bold" style={{ color: 'rgba(0,245,255,0.4)' }}>STUDY RPG</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/5">
            <HiXMark className="text-xl text-slate-400" />
          </button>
        </div>

        {/* Player Card */}
        <div className="mx-3 mt-4 rounded-2xl p-4 relative overflow-hidden"
          style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.12)' }}>
          {/* Holographic shimmer */}
          <div className="absolute inset-0 holo-card rounded-2xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex-shrink-0">
                <AvatarDisplay avatarStr={avatarStr} name={user?.name || 'U'} size="md" />
                <div className="absolute -bottom-1 -right-1 text-sm">{rank.icon}</div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-white truncate">{user?.name || 'Player'}</p>
                <p className="text-[10px] font-bold" style={{ color: rank.color }}>{rank.label}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black" style={{ color: '#ffd700' }}>{points}</p>
                <p className="text-[9px] font-bold" style={{ color: 'rgba(255,215,0,0.5)' }}>XP</p>
              </div>
            </div>
            {/* XP Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px]" style={{ color: 'rgba(0,245,255,0.4)' }}>
                <span>XP Progress</span><span>{xpPct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1.4, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, #00f5ff, ${rank.color})`, boxShadow: `0 0 8px ${rank.color}` }} />
              </div>
              <p className="text-[9px]" style={{ color: 'rgba(0,245,255,0.3)' }}>Next: {nextRank.label} ({nextRank.min} XP)</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.filter(i => i.roles.includes(user?.role || 'student')).map((item) => {
            const Icon   = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={active ? {
                  background: `${item.color}12`,
                  border: `1px solid ${item.color}30`,
                  color: item.color,
                  boxShadow: `0 0 20px ${item.color}15`,
                } : {
                  color: 'rgba(148,163,184,0.7)',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = `${item.color}08`; e.currentTarget.style.color = item.color; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(148,163,184,0.7)'; } }}>
                {active && (
                  <motion.div layoutId="nav-pill"
                    className="absolute inset-y-1 left-0 w-0.5 rounded-full"
                    style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                )}
                <Icon className="text-base flex-shrink-0" />
                <span className="flex-1 font-semibold">{item.label}</span>
                {active && <HiOutlineBolt className="text-xs animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 space-y-2" style={{ borderTop: '1px solid rgba(0,245,255,0.06)' }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.1)' }}>
            <HiOutlineTrophy style={{ color: '#ffd700' }} className="text-sm" />
            <span className="text-xs text-slate-400">Daily Streak</span>
            <span className="ml-auto text-xs font-black" style={{ color: '#ffd700' }}>🔥 {user?.streak || 1}</span>
          </div>
          <button onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all"
            style={{ border: '1px solid rgba(255,0,80,0.2)', background: 'rgba(255,0,80,0.05)', color: 'rgba(255,100,100,0.8)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,0,80,0.12)'; e.currentTarget.style.color = '#ff6464'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,0,80,0.05)'; e.currentTarget.style.color = 'rgba(255,100,100,0.8)'; }}>
            <HiOutlineArrowRightOnRectangle className="text-base" />
            Logout
          </button>
        </div>

        {/* Bottom accent line */}
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #bf00ff, #ff0080, transparent)' }} />
      </aside>

      {/* ── MAIN ── */}
      <div className="relative flex-1 overflow-hidden">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-96 w-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.04), transparent)' }} />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(191,0,255,0.04), transparent)' }} />
          <div className="absolute inset-0 grid-pattern" />
        </div>

        <div className="relative flex h-full flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-20 backdrop-blur-xl"
            style={{ borderBottom: '1px solid rgba(0,245,255,0.06)', background: 'rgba(3,3,8,0.85)' }}>
            <div className="flex items-center justify-between px-4 sm:px-8 py-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/5">
                <HiBars3 className="text-2xl text-slate-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ border: '1px solid rgba(255,215,0,0.2)', background: 'rgba(255,215,0,0.06)' }}>
                  <HiOutlineBolt style={{ color: '#ffd700' }} className="text-xs" />
                  <span className="text-xs font-black" style={{ color: '#ffd700' }}>{points} XP</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ border: `1px solid ${rank.color}30`, background: `${rank.color}08` }}>
                  <span className="text-sm">{rank.icon}</span>
                  <span className="text-xs font-black" style={{ color: rank.color }}>{rank.label}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <AvatarDisplay avatarStr={avatarStr} name={user?.name || 'U'} size="sm" />
              </div>
            </div>
          </header>

          {/* Page content */}
          <motion.main key={location.pathname}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 overflow-auto px-4 py-6 sm:px-8 sm:py-8">
            <Outlet />
          </motion.main>
        </div>
      </div>

      <NexusAI />
    </div>
  );
}
