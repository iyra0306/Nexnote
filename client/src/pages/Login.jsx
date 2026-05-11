import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiArrowRight } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/api';
import { useToast } from '../components/Toast';

const RANKS = [
  { icon: '🌱', label: 'Novice',  xp: '0 XP',   color: '#94a3b8', pct: 20 },
  { icon: '📖', label: 'Scholar', xp: '50 XP',  color: '#06b6d4', pct: 40 },
  { icon: '⚡', label: 'Adept',   xp: '150 XP', color: '#6366f1', pct: 60 },
  { icon: '🔮', label: 'Expert',  xp: '300 XP', color: '#a855f7', pct: 80 },
  { icon: '👑', label: 'Master',  xp: '500 XP', color: '#fbbf24', pct: 100 },
];

const FEATURES = [
  { icon: '📚', title: 'Smart Library',    desc: 'Notes organized by dept & semester' },
  { icon: '🎯', title: 'Exam Mode',        desc: 'Filter only exam-critical content' },
  { icon: '⚡', title: 'XP System',        desc: 'Earn points for every action' },
  { icon: '🤖', title: 'NEXUS AI',         desc: 'Built-in AI study companion' },
];

export default function Login() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(email, password);
      login(data);
      addToast('Welcome back! ✨', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden" style={{ background: '#050510' }}>

      {/* Aurora background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-orb w-[600px] h-[600px] -top-32 -left-32 opacity-30"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
        <div className="aurora-orb w-[500px] h-[500px] -bottom-20 -right-20 opacity-25"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)', animationDelay: '-7s' }} />
        <div className="aurora-orb w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)', animationDelay: '-14s' }} />
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-100" />
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-16 relative">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-14 w-auto object-contain"
            onError={(e) => e.target.style.display='none'} />
        </motion.div>

        <div className="space-y-12">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold glass"
              style={{ color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)' }}>
              <span className="h-2 w-2 rounded-full bg-[#a855f7] animate-pulse" />
              Chitkara University · Punjab, India
            </div>
            <h1 className="text-6xl font-black leading-[1.05] tracking-tight text-white">
              Study Smarter.<br />
              <span className="text-gradient">Level Up</span><br />
              <span className="text-white">Faster.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              The gamified notes platform where every download, comment, and upload earns you XP. Climb from Novice to Legend.
            </p>
          </motion.div>

          {/* Feature grid */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="rounded-2xl p-4 glass card-lift">
                <span className="text-2xl block mb-2">{f.icon}</span>
                <p className="text-sm font-bold text-white">{f.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Rank preview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-600 font-semibold">Rank Progression</p>
            <div className="flex items-center gap-2">
              {RANKS.map((r, i) => (
                <motion.div key={r.label} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.06, type: 'spring' }}
                  className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl glass"
                    style={{ border: `1px solid ${r.color}30` }}>
                    {r.icon}
                  </div>
                  <p className="text-[9px] font-bold" style={{ color: r.color }}>{r.label}</p>
                  <p className="text-[8px] text-slate-600">{r.xp}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <p className="text-xs text-slate-700">© 2026 NEXNOTE · Iyra, Neeti, Manleen & Eknoor</p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-[45%] items-center justify-center px-6 py-12 relative">
        {/* Vertical divider */}
        <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-3/4 w-px"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.3), rgba(168,85,247,0.3), transparent)' }} />

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-16 w-auto"
              onError={(e) => e.target.style.display='none'} />
          </div>

          {/* Form card */}
          <div className="rounded-3xl p-8 glass-strong noise"
            style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)' }}>

            <div className="mb-8 space-y-1">
              <h2 className="text-2xl font-black text-white">Welcome back 👋</h2>
              <p className="text-sm text-slate-500">Sign in to continue your journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Email</label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-600"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                    placeholder="you@chitkara.edu.in" required />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl pl-11 pr-12 py-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-600"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                    placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPassword ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                className="relative w-full overflow-hidden rounded-2xl py-4 text-sm font-bold text-white disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)', boxShadow: '0 8px 30px rgba(99,102,241,0.4)' }}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">✦</motion.span> Signing in...</>
                  ) : (
                    <>Sign In <HiArrowRight className="text-base" /></>
                  )}
                </span>
                {!loading && (
                  <motion.div className="absolute inset-0 bg-white/10" initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />
                )}
              </motion.button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-xs text-slate-600">Don't have an account?</span>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>

            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-slate-300 transition-all glass"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgb(203,213,225)'; }}>
                Create Account
              </motion.div>
            </Link>
          </div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="mt-5 grid grid-cols-3 gap-3">
            {[['500+','Notes'],['4','Depts'],['100+','Students']].map(([v, l]) => (
              <div key={l} className="rounded-2xl p-3 text-center glass">
                <p className="text-base font-black text-gradient">{v}</p>
                <p className="text-[10px] text-slate-600">{l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
