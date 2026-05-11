import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome, HiOutlineCloudArrowUp, HiOutlineDocumentText,
  HiOutlineHeart, HiOutlineChartBar, HiOutlineInformationCircle,
  HiOutlineArrowRightOnRectangle, HiOutlineUser, HiBars3, HiXMark,
  HiOutlineMegaphone, HiOutlineEnvelope, HiOutlineBolt, HiOutlineTrophy,
  HiOutlineFire, HiChevronDown,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { AvatarDisplay } from './AvatarBuilder';
import NexusAI from './NexusAI';

const NAV = [
  { path: '/dashboard',     label: 'Home',          icon: HiOutlineHome,              roles: ['student','teacher','admin'] },
  { path: '/notes',         label: 'Notes',         icon: HiOutlineDocumentText,      roles: ['student','teacher','admin'] },
  { path: '/upload',        label: 'Upload',        icon: HiOutlineCloudArrowUp,      roles: ['teacher','admin'] },
  { path: '/favorites',     label: 'Favorites',     icon: HiOutlineHeart,             roles: ['student','teacher','admin'] },
  { path: '/analytics',     label: 'Analytics',     icon: HiOutlineChartBar,          roles: ['teacher','admin'] },
  { path: '/announcements', label: 'Announcements', icon: HiOutlineMegaphone,         roles: ['student','teacher','admin'] },
];

const MORE = [
  { path: '/profile', label: 'My Profile', icon: HiOutlineUser },
  { path: '/about',   label: 'About',      icon: HiOutlineInformationCircle },
  { path: '/contact', label: 'Contact',    icon: HiOutlineEnvelope },
];

const RANKS = [
  { min: 0,   label: 'Novice',  icon: '🌱', color: '#94a3b8' },
  { min: 50,  label: 'Scholar', icon: '📖', color: '#06b6d4' },
  { min: 150, label: 'Adept',   icon: '⚡', color: '#7c3aed' },
  { min: 300, label: 'Expert',  icon: '🔮', color: '#a855f7' },
  { min: 500, label: 'Master',  icon: '👑', color: '#fbbf24' },
  { min: 999, label: 'Legend',  icon: '🌟', color: '#db2777' },
];

function getRank(pts = 0) {
  return [...RANKS].reverse().find(r => pts >= r.min) || RANKS[0];
}

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [avatarStr, setAvatarStr] = useState(() => localStorage.getItem('nexnote_avatar') || '');
  const profileRef = useRef(null);
  const moreRef    = useRef(null);

  useEffect(() => {
    setAvatarStr(localStorage.getItem('nexnote_avatar') || '');
    const h = () => setAvatarStr(localStorage.getItem('nexnote_avatar') || '');
    window.addEventListener('storage', h);
    window.addEventListener('nexnote_avatar_changed', h);
    return () => { window.removeEventListener('storage', h); window.removeEventListener('nexnote_avatar_changed', h); };
  }, [user?._id]);

  // Close dropdowns on outside click
  useEffect(() => {
    const h = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const points   = user?.points || 0;
  const rank     = getRank(points);
  const nextRank = RANKS.find(r => r.min > points) || RANKS[RANKS.length - 1];
  const xpPct    = Math.min(100, Math.round((points / nextRank.min) * 100));
  const visibleNav = NAV.filter(i => i.roles.includes(user?.role || 'student'));

  return (
    <div className="min-h-screen mesh-bg dot-bg text-slate-100">

      {/* ── TOP NAVIGATION ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: 'rgba(15,15,35,0.92)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 flex-shrink-0">
              <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-9 w-auto object-contain"
                onError={(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex'; }} />
              <div className="hidden h-9 w-9 items-center justify-center rounded-xl font-black text-white text-base"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}>N</div>
              <span className="hidden sm:block text-base font-black g-text tracking-wide">NEXNOTE</span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {visibleNav.map(item => {
                const Icon   = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={active
                      ? { background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)' }
                      : { color: 'rgba(148,163,184,0.8)', border: '1px solid transparent' }}
                    onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; } }}
                    onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(148,163,184,0.8)'; } }}>
                    <Icon className="text-base" />
                    {item.label}
                  </Link>
                );
              })}

              {/* More dropdown */}
              <div className="relative" ref={moreRef}>
                <button onClick={() => setMoreOpen(!moreOpen)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ color: 'rgba(148,163,184,0.8)', border: '1px solid transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={(e) => { if (!moreOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(148,163,184,0.8)'; } }}>
                  More <HiChevronDown className={`text-sm transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-48 rounded-2xl overflow-hidden shadow-2xl"
                      style={{ background: '#1a1a30', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {MORE.map(item => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.path} to={item.path} onClick={() => setMoreOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                            <Icon className="text-base text-slate-500" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* XP Badge */}
              <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
                style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa' }}>
                <HiOutlineBolt className="text-xs" />
                {points} XP
              </div>

              {/* Rank */}
              <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
                style={{ background: `${rank.color}15`, border: `1px solid ${rank.color}30`, color: rank.color }}>
                {rank.icon} {rank.label}
              </div>

              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:bg-white/5">
                  <AvatarDisplay avatarStr={avatarStr} name={user?.name || 'U'} size="sm" />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-white leading-none">{user?.name?.split(' ')[0] || 'Hero'}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user?.role}</p>
                  </div>
                  <HiChevronDown className={`hidden sm:block text-sm text-slate-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-14 w-72 rounded-2xl overflow-hidden shadow-2xl"
                      style={{ background: '#1a1a30', border: '1px solid rgba(255,255,255,0.1)' }}>

                      {/* Profile header */}
                      <div className="p-4" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(219,39,119,0.1))' }}>
                        <div className="flex items-center gap-3 mb-3">
                          <AvatarDisplay avatarStr={avatarStr} name={user?.name || 'U'} size="md" />
                          <div>
                            <p className="text-sm font-black text-white">{user?.name || 'Hero'}</p>
                            <p className="text-xs text-slate-400">{user?.email}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-xs font-bold" style={{ color: rank.color }}>{rank.icon} {rank.label}</span>
                            </div>
                          </div>
                        </div>
                        {/* XP bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>{points} XP</span><span>{xpPct}% to {nextRank.label}</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1.2 }}
                              className="h-full rounded-full"
                              style={{ background: 'linear-gradient(90deg, #7c3aed, #db2777)' }} />
                          </div>
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-3 divide-x" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', divideColor: 'rgba(255,255,255,0.06)' }}>
                        {[
                          { icon: '🔥', val: user?.streak || 1, label: 'Streak' },
                          { icon: '⚡', val: points, label: 'XP' },
                          { icon: rank.icon, val: rank.label, label: 'Rank' },
                        ].map(s => (
                          <div key={s.label} className="flex flex-col items-center py-3 gap-0.5">
                            <span className="text-base">{s.icon}</span>
                            <span className="text-xs font-black text-white">{s.val}</span>
                            <span className="text-[9px] text-slate-600">{s.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="p-2">
                        {[
                          { path: '/profile', label: 'My Profile', icon: HiOutlineUser },
                          { path: '/about',   label: 'About',      icon: HiOutlineInformationCircle },
                        ].map(item => {
                          const Icon = item.icon;
                          return (
                            <Link key={item.path} to={item.path} onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                              <Icon className="text-base text-slate-500" />
                              {item.label}
                            </Link>
                          );
                        })}
                        <button onClick={() => { logout(); navigate('/login'); setProfileOpen(false); }}
                          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
                          style={{ color: '#fca5a5' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                          <HiOutlineArrowRightOnRectangle className="text-base" style={{ color: '#f87171' }} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu button */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-xl hover:bg-white/5">
                {mobileOpen ? <HiXMark className="text-xl" /> : <HiBars3 className="text-xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="lg:hidden overflow-hidden"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-4 py-3 space-y-1">
                {[...visibleNav, ...MORE].map(item => {
                  const Icon   = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                      style={active
                        ? { background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }
                        : { color: 'rgba(148,163,184,0.8)' }}>
                      <Icon className="text-base" />
                      {item.label}
                    </Link>
                  );
                })}
                <button onClick={() => { logout(); navigate('/login'); }}
                  className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ color: '#fca5a5' }}>
                  <HiOutlineArrowRightOnRectangle className="text-base" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── PAGE CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div key={location.pathname}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <Outlet />
        </motion.div>
      </main>

      <NexusAI />
    </div>
  );
}
