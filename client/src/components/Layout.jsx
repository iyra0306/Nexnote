import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome, HiOutlineCloudArrowUp, HiOutlineDocumentText,
  HiOutlineHeart, HiOutlineChartBar, HiOutlineInformationCircle,
  HiOutlineArrowRightOnRectangle, HiOutlineUser, HiBars3, HiXMark,
  HiOutlineMegaphone, HiOutlineEnvelope, HiOutlineBolt,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { AvatarDisplay } from './AvatarBuilder';
import NexusAI from './NexusAI';

const navItems = [
  { path: '/dashboard',     label: 'Dashboard',     icon: HiOutlineHome,              roles: ['student','teacher','admin'] },
  { path: '/upload',        label: 'Upload Notes',  icon: HiOutlineCloudArrowUp,      roles: ['teacher','admin'] },
  { path: '/notes',         label: 'Note Library',  icon: HiOutlineDocumentText,      roles: ['student','teacher','admin'] },
  { path: '/favorites',     label: 'Favorites',     icon: HiOutlineHeart,             roles: ['student','teacher','admin'] },
  { path: '/analytics',     label: 'Analytics',     icon: HiOutlineChartBar,          roles: ['teacher','admin'] },
  { path: '/announcements', label: 'Announcements', icon: HiOutlineMegaphone,         roles: ['student','teacher','admin'] },
  { path: '/profile',       label: 'My Profile',    icon: HiOutlineUser,              roles: ['student','teacher','admin'] },
  { path: '/about',         label: 'About',         icon: HiOutlineInformationCircle, roles: ['student','teacher','admin'] },
  { path: '/contact',       label: 'Contact',       icon: HiOutlineEnvelope,          roles: ['student','teacher','admin'] },
];

const RANK_LEVELS = [
  { min: 0,   label: 'Novice',  icon: '🌱', color: '#94a3b8' },
  { min: 50,  label: 'Scholar', icon: '📖', color: '#06b6d4' },
  { min: 150, label: 'Adept',   icon: '⚡', color: '#6366f1' },
  { min: 300, label: 'Expert',  icon: '🔮', color: '#a855f7' },
  { min: 500, label: 'Master',  icon: '👑', color: '#fbbf24' },
  { min: 999, label: 'Legend',  icon: '🌟', color: '#ec4899' },
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

  const points   = user?.points || 0;
  const rank     = getRank(points);
  const nextRank = RANK_LEVELS.find(r => r.min > points) || RANK_LEVELS[RANK_LEVELS.length - 1];
  const xpPct    = Math.min(100, Math.round((points / nextRank.min) * 100));

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex min-h-screen text-slate-100" style={{ background: '#050510' }}>

      {/* Aurora background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="aurora-orb w-[500px] h-[500px] -top-40 -left-40 opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
        <div className="aurora-orb w-[400px] h-[400px] -bottom-20 -right-20 opacity-15"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)', animationDelay: '-10s' }} />
        <div className="absolute inset-0 dot-grid" />
      </div>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <aside className={`fixed lg:relative z-50 w-64 flex flex-col h-screen transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: 'rgba(5,5,18,0.95)', borderRight: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(30px)' }}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3">
            <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-10 w-auto object-contain rounded-xl"
              onError={(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex'; }} />
            <div className="hidden h-10 w-10 items-center justify-center rounded-xl font-black text-white text-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>N</div>
            <div>
              <p className="text-sm font-black tracking-widest text-gradient">NEXNOTE</p>
              <p className="text-[9px] tracking-[0.25em] text-slate-600 font-medium">STUDY RPG</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/5">
            <HiXMark className="text-xl text-slate-400" />
          </button>
        </div>

        {/* Player Card */}
        <div className="mx-3 mt-4 rounded-2xl p-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.08), rgba(236,72,153,0.08))', border: '1px solid rgba(99,102,241,0.15)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-shrink-0">
              <AvatarDisplay avatarStr={avatarStr} name={user?.name || 'U'} size="md" />
              <div className="absolute -bottom-1 -right-1 text-sm">{rank.icon}</div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-white truncate">{user?.name || 'Player'}</p>
              <p className="text-[10px] font-semibold" style={{ color: rank.color }}>{rank.label}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-black text-gradient">{points}</p>
              <p className="text-[9px] text-slate-600">XP</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] text-slate-600">
              <span>Progress</span><span>{xpPct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1.4, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)', boxShadow: '0 0 8px rgba(99,102,241,0.6)' }} />
            </div>
            <p className="text-[9px] text-slate-700">Next: {nextRank.label} ({nextRank.min} XP)</p>
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
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))',
                  border: '1px solid rgba(99,102,241,0.25)',
                  color: 'white',
                } : {
                  color: 'rgba(148,163,184,0.7)',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(148,163,184,0.7)'; } }}>
                {active && (
                  <motion.div layoutId="nav-pill"
                    className="absolute inset-y-1 left-0 w-0.5 rounded-full"
                    style={{ background: 'linear-gradient(180deg, #6366f1, #ec4899)' }} />
                )}
                <Icon className="text-base flex-shrink-0" style={active ? { color: '#a855f7' } : {}} />
                <span className="flex-1">{item.label}</span>
                {active && <HiOutlineBolt className="text-xs" style={{ color: '#a855f7' }} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.12)' }}>
            <span className="text-sm">🔥</span>
            <span className="text-xs text-slate-400">Daily Streak</span>
            <span className="ml-auto text-xs font-black text-gradient-gold">{user?.streak || 1} days</span>
          </div>
          <button onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
            style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', color: 'rgba(252,165,165,0.8)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#fca5a5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; e.currentTarget.style.color = 'rgba(252,165,165,0.8)'; }}>
            <HiOutlineArrowRightOnRectangle className="text-base" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="relative flex-1 overflow-hidden z-10">
        <div className="relative flex h-full flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-20 backdrop-blur-xl"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(5,5,16,0.8)' }}>
            <div className="flex items-center justify-between px-4 sm:px-8 py-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/5">
                <HiBars3 className="text-2xl text-slate-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5"
                  style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <HiOutlineBolt className="text-xs" style={{ color: '#a855f7' }} />
                  <span className="text-xs font-bold text-gradient">{points} XP</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5"
                  style={{ background: `${rank.color}10`, border: `1px solid ${rank.color}25` }}>
                  <span className="text-sm">{rank.icon}</span>
                  <span className="text-xs font-bold" style={{ color: rank.color }}>{rank.label}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <AvatarDisplay avatarStr={avatarStr} name={user?.name || 'U'} size="sm" />
              </div>
            </div>
          </header>

          {/* Page content */}
          <motion.main key={location.pathname}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
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
