import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome, HiOutlineCloudArrowUp, HiOutlineDocumentText,
  HiOutlineHeart, HiOutlineChartBar, HiOutlineInformationCircle,
  HiOutlineArrowRightOnRectangle, HiOutlineUser, HiBars3, HiXMark,
  HiOutlineMegaphone, HiOutlineEnvelope, HiOutlineBolt, HiOutlineTrophy,
  HiOutlineFire, HiChevronDown, HiOutlineShieldCheck,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { AvatarDisplay } from './AvatarBuilder';
import NexusAI from './NexusAI';

const NAV = [
  { path: '/dashboard',     label: 'HQ',            icon: HiOutlineHome,         roles: ['student','teacher','admin'], color: '#00d4aa' },
  { path: '/notes',         label: 'LIBRARY',        icon: HiOutlineDocumentText, roles: ['student','teacher','admin'], color: '#00d4aa' },
  { path: '/upload',        label: 'UPLOAD',         icon: HiOutlineCloudArrowUp, roles: ['teacher','admin'],           color: '#f0b429' },
  { path: '/favorites',     label: 'SAVED',          icon: HiOutlineHeart,        roles: ['student','teacher','admin'], color: '#ff4757' },
  { path: '/analytics',     label: 'STATS',          icon: HiOutlineChartBar,     roles: ['teacher','admin'],           color: '#2979ff' },
  { path: '/announcements', label: 'COMMS',          icon: HiOutlineMegaphone,    roles: ['student','teacher','admin'], color: '#aa00ff' },
];

const MORE = [
  { path: '/profile', label: 'MY CHARACTER', icon: HiOutlineUser },
  { path: '/about',   label: 'ABOUT',        icon: HiOutlineInformationCircle },
  { path: '/contact', label: 'CONTACT',      icon: HiOutlineEnvelope },
];

const RANKS = [
  { min: 0,   label: 'NOVICE',  icon: '🌱', color: '#94a3b8' },
  { min: 50,  label: 'SCHOLAR', icon: '📖', color: '#00e676' },
  { min: 150, label: 'ADEPT',   icon: '⚡', color: '#2979ff' },
  { min: 300, label: 'EXPERT',  icon: '🔮', color: '#aa00ff' },
  { min: 500, label: 'MASTER',  icon: '👑', color: '#f0b429' },
  { min: 999, label: 'LEGEND',  icon: '🌟', color: '#ff4757' },
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
    <div className="min-h-screen hex-bg grid-lines text-slate-100" style={{ background: '#020408' }}>

      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div style={{ position: 'absolute', top: '-5%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,170,0.05), transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,180,41,0.04), transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {/* ── HUD TOP BAR ── */}
      <header className="sticky top-0 z-50 hud" style={{ borderBottom: '1px solid rgba(0,212,170,0.1)' }}>
        {/* Top accent line */}
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #00d4aa 30%, #f0b429 70%, transparent)' }} />

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 flex-shrink-0">
              <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-9 w-auto object-contain"
                onError={(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex'; }} />
              <div className="hidden h-9 w-9 items-center justify-center rounded-lg font-black text-black text-base"
                style={{ background: 'linear-gradient(135deg, #00d4aa, #00a882)' }}>N</div>
              <div className="hidden sm:block">
                <p className="text-sm font-black tracking-[0.2em] g-teal">NEXNOTE</p>
                <p className="text-[8px] tracking-[0.4em] font-bold" style={{ color: 'rgba(0,212,170,0.4)' }}>STUDY RPG v3.0</p>
              </div>
            </Link>

            {/* Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {visibleNav.map(item => {
                const Icon   = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}
                    className="relative flex items-center gap-2 px-4 py-2 text-xs font-black tracking-widest uppercase transition-all"
                    style={active
                      ? { color: '#00d4aa', background: 'rgba(0,212,170,0.08)', borderBottom: '2px solid #00d4aa' }
                      : { color: 'rgba(148,163,184,0.7)', borderBottom: '2px solid transparent' }}
                    onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = '#00d4aa'; e.currentTarget.style.background = 'rgba(0,212,170,0.04)'; } }}
                    onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = 'rgba(148,163,184,0.7)'; e.currentTarget.style.background = 'transparent'; } }}>
                    <Icon className="text-sm" />
                    {item.label}
                  </Link>
                );
              })}

              {/* More */}
              <div className="relative" ref={moreRef}>
                <button onClick={() => setMoreOpen(!moreOpen)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-black tracking-widest uppercase transition-all"
                  style={{ color: 'rgba(148,163,184,0.7)', borderBottom: '2px solid transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#00d4aa'; }}
                  onMouseLeave={(e) => { if (!moreOpen) e.currentTarget.style.color = 'rgba(148,163,184,0.7)'; }}>
                  MORE <HiChevronDown className={`text-xs transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-52 rounded-xl overflow-hidden"
                      style={{ background: '#0a1520', border: '1px solid rgba(0,212,170,0.15)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
                      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #00d4aa, transparent)' }} />
                      {MORE.map(item => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.path} to={item.path} onClick={() => setMoreOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-xs font-bold tracking-widest uppercase transition-colors"
                            style={{ color: 'rgba(148,163,184,0.7)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,212,170,0.06)'; e.currentTarget.style.color = '#00d4aa'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(148,163,184,0.7)'; }}>
                            <Icon className="text-sm" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right HUD */}
            <div className="flex items-center gap-2">
              {/* XP display */}
              <div className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5"
                style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.15)' }}>
                <HiOutlineBolt className="text-xs" style={{ color: '#00d4aa' }} />
                <span className="text-xs font-black g-teal">{points}</span>
                <span className="text-[9px] font-bold tracking-widest" style={{ color: 'rgba(0,212,170,0.4)' }}>XP</span>
              </div>

              {/* Rank badge */}
              <div className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                style={{ background: `${rank.color}10`, border: `1px solid ${rank.color}25` }}>
                <span className="text-sm">{rank.icon}</span>
                <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: rank.color }}>{rank.label}</span>
              </div>

              {/* Profile */}
              <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:bg-white/5">
                  <AvatarDisplay avatarStr={avatarStr} name={user?.name || 'U'} size="sm" />
                  <HiChevronDown className={`hidden sm:block text-xs transition-transform text-slate-600 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-14 w-80 rounded-2xl overflow-hidden"
                      style={{ background: '#0a1520', border: '1px solid rgba(0,212,170,0.15)', boxShadow: '0 32px 80px rgba(0,0,0,0.9)' }}>

                      {/* Top accent */}
                      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #00d4aa, #f0b429, transparent)' }} />

                      {/* Character header */}
                      <div className="p-5" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(240,180,41,0.04))' }}>
                        <div className="flex items-center gap-4 mb-4">
                          <AvatarDisplay avatarStr={avatarStr} name={user?.name || 'U'} size="lg" />
                          <div>
                            <p className="text-sm font-black text-white">{user?.name || 'Hero'}</p>
                            <p className="text-xs text-slate-500">{user?.email}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-xs font-black tracking-widest uppercase" style={{ color: rank.color }}>{rank.icon} {rank.label}</span>
                              <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
                                style={{ background: `${rank.color}15`, color: rank.color }}>
                                {user?.role}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* XP bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span style={{ color: 'rgba(0,212,170,0.6)' }}>{points} XP</span>
                            <span className="text-slate-600">{xpPct}% → {nextRank.label}</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1.4 }}
                              className="h-full rounded-full"
                              style={{ background: 'linear-gradient(90deg, #00d4aa, #f0b429)', boxShadow: '0 0 8px rgba(0,212,170,0.5)' }} />
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3" style={{ borderBottom: '1px solid rgba(0,212,170,0.08)' }}>
                        {[
                          { icon: '🔥', val: user?.streak || 1, label: 'STREAK' },
                          { icon: '⚡', val: points, label: 'XP' },
                          { icon: rank.icon, val: rank.label, label: 'RANK' },
                        ].map((s, i) => (
                          <div key={s.label} className="flex flex-col items-center py-3 gap-0.5"
                            style={{ borderRight: i < 2 ? '1px solid rgba(0,212,170,0.08)' : 'none' }}>
                            <span className="text-base">{s.icon}</span>
                            <span className="text-xs font-black text-white">{s.val}</span>
                            <span className="text-[8px] font-bold tracking-widest" style={{ color: 'rgba(0,212,170,0.4)' }}>{s.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="p-2">
                        {[
                          { path: '/profile', label: 'MY CHARACTER', icon: HiOutlineUser },
                          { path: '/about',   label: 'ABOUT',        icon: HiOutlineInformationCircle },
                        ].map(item => {
                          const Icon = item.icon;
                          return (
                            <Link key={item.path} to={item.path} onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all"
                              style={{ color: 'rgba(148,163,184,0.6)' }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,212,170,0.06)'; e.currentTarget.style.color = '#00d4aa'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(148,163,184,0.6)'; }}>
                              <Icon className="text-sm" />
                              {item.label}
                            </Link>
                          );
                        })}
                        <button onClick={() => { logout(); navigate('/login'); setProfileOpen(false); }}
                          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all"
                          style={{ color: 'rgba(255,71,87,0.7)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,71,87,0.08)'; e.currentTarget.style.color = '#ff4757'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,71,87,0.7)'; }}>
                          <HiOutlineArrowRightOnRectangle className="text-sm" />
                          DISCONNECT
                        </button>
                      </div>

                      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #f0b429, transparent)' }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-white/5">
                {mobileOpen ? <HiXMark className="text-xl text-[#00d4aa]" /> : <HiBars3 className="text-xl text-slate-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="lg:hidden overflow-hidden"
              style={{ borderTop: '1px solid rgba(0,212,170,0.08)' }}>
              <div className="px-4 py-3 space-y-1">
                {[...visibleNav, ...MORE].map(item => {
                  const Icon   = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all"
                      style={active ? { background: 'rgba(0,212,170,0.08)', color: '#00d4aa' } : { color: 'rgba(148,163,184,0.7)' }}>
                      <Icon className="text-sm" />
                      {item.label}
                    </Link>
                  );
                })}
                <button onClick={() => { logout(); navigate('/login'); }}
                  className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-widest uppercase"
                  style={{ color: '#ff4757' }}>
                  <HiOutlineArrowRightOnRectangle className="text-sm" />
                  DISCONNECT
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom accent */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.2), transparent)' }} />
      </header>

      {/* ── CONTENT ── */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <motion.div key={location.pathname}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <Outlet />
        </motion.div>
      </main>

      <NexusAI />
    </div>
  );
}
