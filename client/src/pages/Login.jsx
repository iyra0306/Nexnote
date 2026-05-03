import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/api';
import { useToast } from '../components/Toast';

const FLOATING_ICONS = ['⚔️','📚','🏆','🎯','⭐','🔮','💎','🛡️','🌟','🔥','📖','🎮'];
const RANKS = [
  { icon: '🌱', label: 'Novice',  xp: '0 XP' },
  { icon: '📖', label: 'Scholar', xp: '50 XP' },
  { icon: '⚡', label: 'Adept',   xp: '150 XP' },
  { icon: '🔮', label: 'Expert',  xp: '300 XP' },
  { icon: '👑', label: 'Master',  xp: '500 XP' },
];

export default function Login() {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [particles, setParticles]   = useState([]);
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      icon: FLOATING_ICONS[i % FLOATING_ICONS.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 6,
      size: 12 + Math.random() * 16,
    })));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(email, password);
      login(data);
      addToast('⚔️ Welcome back, Hero!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="relative flex min-h-screen bg-[#080810] text-slate-100 overflow-hidden">

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map(p => (
          <motion.div key={p.id}
            animate={{ y: [0, -30, 0], x: [0, 10, -10, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size }}
            className="absolute select-none">
            {p.icon}
          </motion.div>
        ))}
        {/* Glow blobs */}
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-amber-500 blur-[150px]" />
        <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-orange-600 blur-[150px]" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative">
        <div className="flex items-center gap-3">
          <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-10 w-auto" onError={(e) => e.target.style.display='none'} />
        </div>

        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs text-amber-300 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              🏛️ Chitkara University
            </div>
            <h1 className="text-5xl font-black leading-tight text-slate-50 mt-4">
              Level Up Your<br />
              <span className="gradient-text-gold">Study Game</span>
              <span className="ml-2">⚔️</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mt-3">
              Earn XP, unlock badges, climb the leaderboard — all while mastering your college subjects!
            </p>
          </motion.div>

          {/* Rank ladder */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-amber-600/70 font-semibold">Rank Ladder</p>
            <div className="space-y-2">
              {RANKS.map((r, i) => (
                <motion.div key={r.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 backdrop-blur">
                  <span className="text-xl">{r.icon}</span>
                  <span className="text-sm font-semibold text-slate-200">{r.label}</span>
                  <span className="ml-auto text-xs text-amber-500 font-bold">{r.xp}</span>
                  <div className="h-1.5 w-16 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                      style={{ width: `${(i + 1) * 20}%` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <p className="text-xs text-slate-600">© 2026 NEXNOTE · Built by Iyra, Neeti, Manleen & Eknoor</p>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md">

          <div className="mb-6 flex justify-center lg:hidden">
            <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-14 w-auto" onError={(e) => e.target.style.display='none'} />
          </div>

          <div className="rounded-3xl border border-amber-500/20 bg-[#0d0d20]/90 p-8 shadow-[0_32px_100px_rgba(245,158,11,0.1)] backdrop-blur-2xl">
            {/* Header */}
            <div className="mb-8 text-center space-y-2">
              <div className="text-4xl mb-2">⚔️</div>
              <h2 className="text-2xl font-black text-slate-50">Enter the Arena</h2>
              <p className="text-sm text-slate-400">Sign in to continue your quest</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-amber-600/80">Email Address</label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 text-lg" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-amber-500/20 bg-slate-950/60 pl-11 pr-4 py-3.5 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 placeholder:text-slate-600"
                    placeholder="you@chitkara.edu.in" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-amber-600/80">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 text-lg" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-amber-500/20 bg-slate-950/60 pl-11 pr-12 py-3.5 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 placeholder:text-slate-600"
                    placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-400 transition-colors">
                    {showPassword ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
                  </button>
                </div>
              </div>

              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
                className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 py-4 text-sm font-black text-white shadow-[0_8px_30px_rgba(245,158,11,0.5)] transition-all hover:shadow-[0_8px_40px_rgba(245,158,11,0.7)] disabled:opacity-60">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? '⏳ Entering...' : <><span>⚔️</span> Enter the Arena <span>→</span></>}
                </span>
                {!loading && (
                  <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />
                )}
              </motion.button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-amber-500/10" />
              <span className="text-xs text-slate-600">New hero?</span>
              <div className="h-px flex-1 bg-amber-500/10" />
            </div>

            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/5 py-3 text-sm font-bold text-amber-400 transition hover:bg-amber-500/10">
                🌱 Create Your Character
              </motion.div>
            </Link>
          </div>

          {/* Stats bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-4 grid grid-cols-3 gap-3">
            {[['500+', '📚 Notes'], ['4', '🏛️ Depts'], ['100+', '🎮 Players']].map(([val, label]) => (
              <div key={label} className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-3 text-center">
                <p className="text-lg font-black text-amber-400">{val}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
