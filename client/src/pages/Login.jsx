import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineShieldCheck } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/api';
import { useToast } from '../components/Toast';

const RANKS = [
  { icon: '🌱', label: 'Novice',  xp: '0',   color: '#94a3b8', rarity: 'COMMON' },
  { icon: '📖', label: 'Scholar', xp: '50',  color: '#00e676', rarity: 'UNCOMMON' },
  { icon: '⚡', label: 'Adept',   xp: '150', color: '#2979ff', rarity: 'RARE' },
  { icon: '🔮', label: 'Expert',  xp: '300', color: '#aa00ff', rarity: 'EPIC' },
  { icon: '👑', label: 'Master',  xp: '500', color: '#f0b429', rarity: 'LEGENDARY' },
];

const STATS = [
  { label: 'NOTES',    val: '500+', icon: '📚', color: '#00d4aa' },
  { label: 'STUDENTS', val: '100+', icon: '🎓', color: '#f0b429' },
  { label: 'DEPTS',    val: '8',    icon: '🏛️', color: '#2979ff' },
  { label: 'XP EARNED',val: '∞',   icon: '⚡', color: '#aa00ff' },
];

export default function Login() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [particles, setParticles]       = useState([]);
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    setParticles(Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      dur: 4 + Math.random() * 8,
      delay: Math.random() * 6,
      color: ['#00d4aa','#f0b429','#2979ff','#aa00ff','#00e676'][i % 5],
    })));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(email, password);
      login(data);
      addToast('⚡ ACCESS GRANTED — Welcome back, Hero!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'ACCESS DENIED', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen hex-bg grid-lines scanlines flex overflow-hidden" style={{ background: '#020408' }}>

      {/* Floating particles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        {particles.map(p => (
          <motion.div key={p.id}
            animate={{ y: [0, -30, 0], opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity }}
            style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: '50%', background: p.color, boxShadow: `0 0 ${p.size * 4}px ${p.color}` }} />
        ))}
        {/* Big glow orbs */}
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.18, 0.08] }} transition={{ duration: 8, repeat: Infinity }}
          style={{ position: 'absolute', top: '-10%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, #00d4aa, transparent 70%)', filter: 'blur(60px)' }} />
        <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.06, 0.14, 0.06] }} transition={{ duration: 10, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #f0b429, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-14 relative z-10">

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-14 w-auto object-contain"
            onError={(e) => e.target.style.display='none'} />
        </motion.div>

        <div className="space-y-10">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.25)', color: '#00d4aa' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
              Chitkara University · Punjab
            </div>
            <h1 className="text-6xl font-black leading-[1.0] tracking-tight">
              <span className="text-white">NEXNOTE</span><br />
              <span className="g-epic text-5xl">STUDY RPG</span><br />
              <span className="text-slate-500 text-3xl font-bold">v3.0 — Gamified Edition</span>
            </h1>
            <p className="text-slate-400 text-base max-w-md leading-relaxed">
              The ultimate college notes platform. Upload scrolls, earn XP, unlock legendary badges, and climb from Novice to Legend.
            </p>
          </motion.div>

          {/* Rank cards */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: 'rgba(0,212,170,0.5)' }}>
              ⚡ RANK PROGRESSION
            </p>
            <div className="grid grid-cols-5 gap-2">
              {RANKS.map((r, i) => (
                <motion.div key={r.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  className="flex flex-col items-center gap-2 rounded-xl p-3 relative overflow-hidden"
                  style={{ background: 'rgba(13,30,46,0.8)', border: `1px solid ${r.color}25` }}>
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                    style={{ background: `radial-gradient(circle at center, ${r.color}08, transparent)` }} />
                  <span className="text-2xl">{r.icon}</span>
                  <div className="text-center">
                    <p className="text-[10px] font-black" style={{ color: r.color }}>{r.label}</p>
                    <p className="text-[8px] font-bold tracking-widest" style={{ color: `${r.color}60` }}>{r.rarity}</p>
                    <p className="text-[9px] text-slate-600 mt-0.5">{r.xp} XP</p>
                  </div>
                  {/* Bottom bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: `linear-gradient(90deg, transparent, ${r.color}, transparent)` }} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="grid grid-cols-4 gap-3">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.06 }}
                className="rounded-xl p-3 text-center relative overflow-hidden"
                style={{ background: 'rgba(13,30,46,0.8)', border: `1px solid ${s.color}20` }}>
                <span className="text-xl block mb-1">{s.icon}</span>
                <p className="text-lg font-black" style={{ color: s.color }}>{s.val}</p>
                <p className="text-[9px] font-bold tracking-widest text-slate-600">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <p className="text-xs text-slate-700 z-10">© 2026 NEXNOTE · Iyra · Neeti · Manleen · Eknoor</p>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div className="flex w-full lg:w-[45%] items-center justify-center px-6 py-12 relative z-10"
        style={{ borderLeft: '1px solid rgba(0,212,170,0.06)' }}>
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-16 w-auto"
              onError={(e) => e.target.style.display='none'} />
          </div>

          {/* Form card */}
          <div className="relative rounded-2xl p-8 bracket-tl bracket-br"
            style={{ background: 'linear-gradient(135deg, rgba(13,30,46,0.98), rgba(6,13,20,0.99))', border: '1px solid rgba(0,212,170,0.15)', boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(0,212,170,0.04)' }}>

            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #00d4aa, #f0b429, transparent)' }} />

            {/* Header */}
            <div className="mb-8 space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)' }}>
                  <HiOutlineShieldCheck className="text-base" style={{ color: '#00d4aa' }} />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#00d4aa' }}>
                  AUTHENTICATION PORTAL
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">ENTER THE REALM</h2>
              <p className="text-sm text-slate-500">Sign in to access your study arsenal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: 'rgba(0,212,170,0.6)' }}>
                  IDENTIFIER
                </label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'rgba(0,212,170,0.4)' }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-700 font-mono"
                    style={{ background: 'rgba(0,212,170,0.04)', border: '1px solid rgba(0,212,170,0.12)' }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(0,212,170,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,170,0.08), 0 0 20px rgba(0,212,170,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(0,212,170,0.12)'; e.target.style.boxShadow = 'none'; }}
                    placeholder="hero@chitkara.edu.in" required />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: 'rgba(0,212,170,0.6)' }}>
                  SECRET KEY
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'rgba(0,212,170,0.4)' }} />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl pl-11 pr-12 py-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-700 font-mono"
                    style={{ background: 'rgba(0,212,170,0.04)', border: '1px solid rgba(0,212,170,0.12)' }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(0,212,170,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,170,0.08), 0 0 20px rgba(0,212,170,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(0,212,170,0.12)'; e.target.style.boxShadow = 'none'; }}
                    placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'rgba(0,212,170,0.4)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#00d4aa'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,212,170,0.4)'}>
                    {showPassword ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
                className="relative w-full overflow-hidden rounded-xl py-4 text-sm font-black text-black disabled:opacity-60 tracking-widest uppercase"
                style={{ background: 'linear-gradient(135deg, #00d4aa, #00a882)', boxShadow: '0 8px 25px rgba(0,212,170,0.35)' }}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading
                    ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">⚡</motion.span> AUTHENTICATING...</>
                    : '⚡ ENTER THE REALM'}
                </span>
                {!loading && <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />}
              </motion.button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: 'rgba(0,212,170,0.08)' }} />
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-700">NEW HERO?</span>
              <div className="h-px flex-1" style={{ background: 'rgba(0,212,170,0.08)' }} />
            </div>

            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-black tracking-widest uppercase transition-all"
                style={{ border: '1px solid rgba(0,212,170,0.2)', background: 'rgba(0,212,170,0.04)', color: '#00d4aa' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,212,170,0.08)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,170,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,212,170,0.04)'; e.currentTarget.style.boxShadow = 'none'; }}>
                🌱 CREATE CHARACTER
              </motion.div>
            </Link>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #f0b429, transparent)' }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
