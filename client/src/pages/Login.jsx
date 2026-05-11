import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineBolt } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/api';
import { useToast } from '../components/Toast';

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 3,
  duration: 3 + Math.random() * 7,
  delay: Math.random() * 5,
  color: ['#00f5ff','#bf00ff','#ff0080','#00ff88','#ffd700'][i % 5],
}));

const STATS = [
  { val: '500+', label: 'Notes Shared', icon: '📚' },
  { val: '4',    label: 'Departments',  icon: '🏛️' },
  { val: '100+', label: 'Students',     icon: '🎓' },
];

const RANKS = [
  { icon: '🌱', label: 'Novice',  xp: '0',   color: '#94a3b8' },
  { icon: '📖', label: 'Scholar', xp: '50',  color: '#00f5ff' },
  { icon: '⚡', label: 'Adept',   xp: '150', color: '#bf00ff' },
  { icon: '🔮', label: 'Expert',  xp: '300', color: '#ff0080' },
  { icon: '👑', label: 'Master',  xp: '500', color: '#ffd700' },
];

export default function Login() {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]       = useState(false);
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(email, password);
      login(data);
      addToast('⚡ Welcome back, Hero!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="relative flex min-h-screen bg-[#030308] text-slate-100 overflow-hidden">
      {/* Scan line */}
      <div className="scan-line" />

      {/* Animated particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map(p => (
          <motion.div key={p.id}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity }}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color, borderRadius: '50%', boxShadow: `0 0 ${p.size * 4}px ${p.color}` }}
            className="absolute" />
        ))}

        {/* Big glow orbs */}
        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 6, repeat: Infinity }}
          className="absolute -left-32 top-1/4 h-96 w-96 rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, #00f5ff, transparent)' }} />
        <motion.div animate={{ scale: [1.3, 1, 1.3], opacity: [0.1, 0.25, 0.1] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, #bf00ff, transparent)' }} />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, #ff0080, transparent)' }} />

        {/* Grid */}
        <div className="absolute inset-0 grid-pattern opacity-100" />
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-14 w-auto object-contain"
            onError={(e) => e.target.style.display='none'} />
        </motion.div>

        <div className="space-y-10">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold"
              style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.3)', color: '#00f5ff' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#00f5ff] animate-pulse" />
              🏛️ Chitkara University
            </div>
            <h1 className="text-6xl font-black leading-none tracking-tight">
              <span className="text-white">Level Up</span><br />
              <span className="gradient-text-cyber">Your Study</span><br />
              <span className="text-white">Game</span>
              <span className="ml-3 text-5xl">⚡</span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Earn XP, unlock badges, climb the leaderboard — all while mastering your college subjects.
            </p>
          </motion.div>

          {/* Rank ladder */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: 'rgba(0,245,255,0.6)' }}>
              ⚡ Rank Ladder
            </p>
            <div className="space-y-2">
              {RANKS.map((r, i) => (
                <motion.div key={r.label}
                  initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(10,10,30,0.8)', border: `1px solid ${r.color}22` }}>
                  <span className="text-xl">{r.icon}</span>
                  <span className="text-sm font-bold text-slate-200">{r.label}</span>
                  <span className="ml-auto text-xs font-black" style={{ color: r.color }}>{r.xp} XP</span>
                  <div className="h-1.5 w-20 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(i + 1) * 20}%` }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${r.color}, ${r.color}88)`, boxShadow: `0 0 8px ${r.color}` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <p className="text-xs text-slate-700">© 2026 NEXNOTE · Built by Iyra, Neeti, Manleen & Eknoor</p>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-16 w-auto"
              onError={(e) => e.target.style.display='none'} />
          </div>

          {/* Card */}
          <div className="relative rounded-3xl p-8 overflow-hidden"
            style={{ background: 'rgba(10,10,24,0.9)', border: '1px solid rgba(0,245,255,0.15)', boxShadow: '0 32px 100px rgba(0,0,0,0.8), 0 0 60px rgba(0,245,255,0.05)' }}>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 rounded-tl-3xl" style={{ borderColor: '#00f5ff' }} />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 rounded-br-3xl" style={{ borderColor: '#bf00ff' }} />

            <div className="mb-8 text-center space-y-2">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-5xl mb-3 inline-block">⚡</motion.div>
              <h2 className="text-3xl font-black text-white">Enter the Arena</h2>
              <p className="text-sm text-slate-500">Sign in to continue your quest</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: 'rgba(0,245,255,0.7)' }}>
                  Email Address
                </label>
                <div className="relative group">
                  <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors group-focus-within:text-[#00f5ff]" style={{ color: 'rgba(0,245,255,0.5)' }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600"
                    style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.15)' }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(0,245,255,0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(0,245,255,0.15)'}
                    placeholder="you@chitkara.edu.in" required />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: 'rgba(0,245,255,0.7)' }}>
                  Password
                </label>
                <div className="relative group">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'rgba(0,245,255,0.5)' }} />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl pl-11 pr-12 py-3.5 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600"
                    style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.15)' }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(0,245,255,0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(0,245,255,0.15)'}
                    placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-[#00f5ff]"
                    style={{ color: 'rgba(0,245,255,0.5)' }}>
                    {showPassword ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
                className="relative w-full overflow-hidden rounded-2xl py-4 text-sm font-black text-white disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #00f5ff, #bf00ff, #ff0080)', boxShadow: '0 8px 30px rgba(0,245,255,0.3)' }}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⚡</motion.span> Entering...</>
                  ) : (
                    <><HiOutlineBolt className="text-lg" /> Enter the Arena →</>
                  )}
                </span>
                {!loading && (
                  <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }} transition={{ duration: 0.6 }} />
                )}
              </motion.button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: 'rgba(0,245,255,0.1)' }} />
              <span className="text-xs text-slate-600">New hero?</span>
              <div className="h-px flex-1" style={{ background: 'rgba(0,245,255,0.1)' }} />
            </div>

            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition-all"
                style={{ border: '1px solid rgba(0,245,255,0.2)', background: 'rgba(0,245,255,0.05)', color: '#00f5ff' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,245,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,245,255,0.05)'}>
                🌱 Create Your Character
              </motion.div>
            </Link>
          </div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-5 grid grid-cols-3 gap-3">
            {STATS.map(({ val, label, icon }) => (
              <div key={label} className="rounded-2xl p-3 text-center"
                style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.1)' }}>
                <p className="text-lg font-black" style={{ color: '#00f5ff' }}>{val}</p>
                <p className="text-[10px] text-slate-500">{icon} {label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
