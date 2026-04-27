import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/api';
import { useToast } from '../components/Toast';

const features = [
  { emoji: '📚', text: 'Organized by Department & Semester' },
  { emoji: '🎯', text: 'Exam Preparation Mode' },
  { emoji: '📢', text: 'Real-time Announcements' },
  { emoji: '⚡', text: 'Instant Download & Access' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(email, password);
      login(data);
      addToast('Welcome back! 🎉', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-[#020617] text-slate-100 overflow-hidden">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-purple-600 blur-[120px]" />
        <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-indigo-600 blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 12, repeat: Infinity }}
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-600 blur-[100px]" />
      </div>

      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative">
        <div className="flex items-center gap-3">
          <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-10 w-auto" onError={(e) => e.target.style.display='none'} />
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs text-purple-300">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
              Chitkara University
            </motion.div>
            <motion.h1 initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="text-4xl font-bold leading-tight text-slate-50">
              The smarter way to<br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                manage college notes
              </span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Upload, organize, and access study materials organized by department and semester. Built for students and teachers.
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-2.5 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 backdrop-blur">
                <span className="text-xl">{f.emoji}</span>
                <span className="text-xs text-slate-300">{f.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <p className="text-xs text-slate-600">© 2024 NEXNOTE · Built by Team Iyra, Neeti, Manleen & Eknoor</p>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-14 w-auto" onError={(e) => e.target.style.display='none'} />
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-[0_32px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
            <div className="mb-8 space-y-1">
              <h2 className="text-2xl font-bold text-slate-50">Welcome back 👋</h2>
              <p className="text-sm text-slate-400">Sign in to continue to your workspace</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Email Address</label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-11 pr-4 py-3.5 text-sm text-slate-100 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 placeholder:text-slate-600"
                    placeholder="you@chitkara.edu.in" required />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-11 pr-12 py-3.5 text-sm text-slate-100 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 placeholder:text-slate-600"
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
                className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_rgba(139,92,246,0.5)] transition-all hover:shadow-[0_8px_40px_rgba(139,92,246,0.7)] disabled:opacity-60 disabled:cursor-not-allowed">
                <span className="relative z-10">{loading ? 'Signing in...' : 'Sign In →'}</span>
                {!loading && (
                  <motion.div className="absolute inset-0 bg-white/10" initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-xs text-slate-600">New to NEXNOTE?</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-slate-100">
                Create an account
              </motion.div>
            </Link>
          </div>

          {/* Stats bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-6 grid grid-cols-3 gap-3">
            {[['500+', 'Notes Shared'], ['4', 'Departments'], ['100+', 'Students']].map(([val, label]) => (
              <div key={label} className="rounded-2xl border border-white/5 bg-white/5 p-3 text-center backdrop-blur">
                <p className="text-lg font-bold text-purple-300">{val}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
