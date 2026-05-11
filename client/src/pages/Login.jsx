import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/api';
import { useToast } from '../components/Toast';

const FEATURES = [
  { icon: '📚', color: '#7c3aed', title: 'Smart Notes Library',   desc: 'Organized by dept & semester' },
  { icon: '🎯', color: '#db2777', title: 'Exam Mode',             desc: 'Filter exam-critical content' },
  { icon: '⚡', color: '#0891b2', title: 'XP & Rank System',      desc: 'Earn points for every action' },
  { icon: '🤖', color: '#059669', title: 'NEXUS AI Assistant',    desc: 'Built-in study companion' },
  { icon: '✉️', color: '#7c3aed', title: 'Message Uploader',      desc: 'Direct feedback to teachers' },
  { icon: '🎨', color: '#db2777', title: 'Custom Avatar',         desc: 'Snapchat-style character' },
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
    <div className="min-h-screen flex mesh-bg dot-bg">

      {/* ── LEFT — Branding ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #db2777, transparent)' }} />

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-14 w-auto object-contain"
            onError={(e) => e.target.style.display='none'} />
        </motion.div>

        {/* Hero text */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
              style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa' }}>
              <span className="h-2 w-2 rounded-full bg-[#a78bfa] animate-pulse" />
              Chitkara University · Punjab
            </div>
            <h1 className="text-5xl font-black leading-tight text-white">
              The Smarter Way<br />
              to <span className="g-text">Study & Share</span><br />
              College Notes
            </h1>
            <p className="text-slate-400 text-base max-w-md leading-relaxed">
              Upload, discover, and download notes organized by department and semester. Earn XP, unlock badges, and level up your academic game.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="flex items-start gap-3 rounded-2xl p-4 card-hover"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg"
                  style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                  {f.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{f.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="text-xs text-slate-700 relative z-10">© 2026 NEXNOTE · Iyra, Neeti, Manleen & Eknoor</p>
      </div>

      {/* ── RIGHT — Form ── */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12"
        style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
          className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-16 w-auto"
              onError={(e) => e.target.style.display='none'} />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-white">Welcome back 👋</h2>
            <p className="text-slate-500 mt-1.5 text-sm">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Email</label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl pl-11 pr-4 py-4 text-sm text-white outline-none transition-all placeholder:text-slate-600"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                  placeholder="you@chitkara.edu.in" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl pl-11 pr-12 py-4 text-sm text-white outline-none transition-all placeholder:text-slate-600"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                  placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
                </button>
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full rounded-2xl py-4 text-sm font-bold text-white disabled:opacity-60 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 8px 25px rgba(124,58,237,0.35)' }}>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading
                  ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">✦</motion.span> Signing in...</>
                  : 'Sign In →'}
              </span>
              {!loading && <motion.div className="absolute inset-0 bg-white/10" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />}
            </motion.button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-xs text-slate-600">New here?</span>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <Link to="/signup">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center rounded-2xl py-4 text-sm font-semibold text-slate-300 transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgb(203,213,225)'; }}>
              Create Account
            </motion.div>
          </Link>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[['500+','Notes'],['4','Depts'],['100+','Students']].map(([v,l]) => (
              <div key={l} className="rounded-2xl p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-sm font-black g-text">{v}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
