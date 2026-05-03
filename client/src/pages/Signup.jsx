import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineUser, HiOutlineEnvelope, HiOutlineLockClosed,
  HiOutlineEye, HiOutlineEyeSlash, HiOutlineAcademicCap,
  HiOutlineIdentification,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/api';
import { useToast } from '../components/Toast';
import AvatarBuilder, { buildAvatarString, AvatarDisplay } from '../components/AvatarBuilder';

const departments = ['CSE', 'ECE', 'Mechanical', 'Civil', 'IT', 'EEE', 'Chemical', 'Biotechnology', 'Other'];
const semesters   = [1, 2, 3, 4, 5, 6, 7, 8];

const FLOATING = ['⚔️','📚','🏆','🎯','⭐','🔮','💎','🛡️','🌟','🔥','📖','🎮','🧙','⚡','🌱'];

const ROLES = [
  { r: 'student', icon: '🎓', title: 'Student',  desc: 'Access notes, download, rate & comment', xp: 'Start at Novice 🌱' },
  { r: 'teacher', icon: '⚔️', title: 'Teacher',  desc: 'Upload notes, post announcements, analytics', xp: 'Start at Scholar 📖' },
];

export default function Signup() {
  const [step, setStep]             = useState(1); // 1=avatar, 2=details
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole]             = useState('student');
  const [department, setDepartment] = useState('');
  const [semester, setSemester]     = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [avatar, setAvatar]         = useState('');
  const [loading, setLoading]       = useState(false);
  const [particles, setParticles]   = useState([]);
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    setParticles(Array.from({ length: 15 }, (_, i) => ({
      id: i, icon: FLOATING[i % FLOATING.length],
      x: Math.random() * 100, y: Math.random() * 100,
      delay: Math.random() * 5, duration: 4 + Math.random() * 6,
      size: 12 + Math.random() * 14,
    })));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.signup(
        name, email, password, role,
        role === 'student' ? department : undefined,
        role === 'student' ? semester   : undefined,
        role === 'student' ? rollNumber : undefined,
      );
      // Store avatar in localStorage for now (can be saved to profile later)
      if (avatar) {
        localStorage.setItem('nexnote_avatar', avatar);
        window.dispatchEvent(new Event('storage'));
      }
      login(data);
      addToast('🎉 Character created! Welcome to NEXNOTE!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Signup failed', 'error');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full rounded-xl border border-amber-500/20 bg-slate-950/60 py-3.5 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 placeholder:text-slate-600";

  return (
    <div className="relative flex min-h-screen bg-[#080810] text-slate-100 overflow-hidden">

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map(p => (
          <motion.div key={p.id}
            animate={{ y: [0, -25, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity }}
            style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size }}
            className="absolute select-none">{p.icon}</motion.div>
        ))}
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-amber-500 blur-[150px]" />
        <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.06, 0.12, 0.06] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-orange-600 blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative">
        <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-10 w-auto" onError={(e) => e.target.style.display='none'} />

        <div className="space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs text-amber-300 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              🏛️ Chitkara University
            </div>
            <h1 className="text-5xl font-black leading-tight text-slate-50">
              Create Your<br />
              <span className="gradient-text-gold">Hero Character</span>
              <span className="ml-2">🧙</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Build your avatar, choose your class, and start your learning quest. Earn XP, unlock badges, and climb the ranks!
            </p>
          </div>

          {/* Role cards */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-amber-700 font-black">⚔️ Choose Your Class</p>
            {ROLES.map(({ r, icon, title, desc, xp }) => (
              <motion.div key={r} whileHover={{ scale: 1.02 }}
                onClick={() => setRole(r)}
                className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                  role === r
                    ? 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                    : 'border-white/5 bg-white/5 hover:border-amber-500/20'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xl ${role === r ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-white/10'}`}>
                    {icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-100">{title}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                    <p className="text-[10px] text-amber-600 font-semibold mt-0.5">{xp}</p>
                  </div>
                  {role === r && (
                    <div className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center">
                      <span className="text-white text-xs font-black">✓</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-600">© 2026 NEXNOTE · Built by Iyra, Neeti, Manleen & Eknoor</p>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-8 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="mb-6 flex justify-center lg:hidden">
            <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-10 w-auto" onError={(e) => e.target.style.display='none'} />
          </div>

          {/* Step indicator */}
          <div className="mb-6 flex items-center gap-3">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step >= s ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'bg-slate-800 text-slate-500'
                }`}>{s}</div>
                <span className={`text-xs font-bold ${step >= s ? 'text-amber-400' : 'text-slate-600'}`}>
                  {s === 1 ? '🎨 Avatar' : '📝 Details'}
                </span>
                {s < 2 && <div className={`flex-1 h-0.5 rounded-full ${step > s ? 'bg-amber-500' : 'bg-slate-800'}`} />}
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-amber-500/20 bg-[#0d0d20]/90 p-6 shadow-[0_32px_100px_rgba(245,158,11,0.1)] backdrop-blur-2xl">

            <AnimatePresence mode="wait">

              {/* STEP 1: Avatar Builder */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-black text-slate-50">🎨 Build Your Avatar</h2>
                    <p className="text-xs text-amber-600/70">Customize your hero character</p>
                  </div>

                  <AvatarBuilder value={avatar} onChange={setAvatar} />

                  {/* Mobile role selector */}
                  <div className="lg:hidden space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">⚔️ Choose Class</p>
                    <div className="grid grid-cols-2 gap-2">
                      {ROLES.map(({ r, icon, title }) => (
                        <button key={r} type="button" onClick={() => setRole(r)}
                          className={`py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${
                            role === r
                              ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-300 border-2 border-amber-500/40'
                              : 'bg-slate-950/40 text-slate-400 border border-white/10 hover:border-amber-500/20'
                          }`}>
                          <span>{icon}</span> {title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.button onClick={() => setStep(2)}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="w-full rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 py-4 text-sm font-black text-white shadow-[0_8px_30px_rgba(245,158,11,0.5)]">
                    ⚔️ Continue to Details →
                  </motion.button>
                </motion.div>
              )}

              {/* STEP 2: Account Details */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} className="space-y-4">

                  <div className="flex items-center gap-4">
                    <button onClick={() => setStep(1)}
                      className="text-amber-500 hover:text-amber-300 text-sm font-black transition-colors">
                      ← Back
                    </button>
                    <div className="flex-1 text-center">
                      <h2 className="text-xl font-black text-slate-50">📝 Hero Details</h2>
                      <p className="text-xs text-amber-600/70">Fill in your character info</p>
                    </div>
                    {/* Avatar preview */}
                    <AvatarDisplay avatarStr={avatar} name={name || 'H'} size="sm" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">👤 Hero Name</label>
                      <div className="relative">
                        <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 text-lg" />
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                          className={`${inputClass} pl-11`} placeholder="Your full name" required />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">📧 Email</label>
                      <div className="relative">
                        <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 text-lg" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                          className={`${inputClass} pl-11`} placeholder="you@chitkara.edu.in" required />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">🔐 Password</label>
                      <div className="relative">
                        <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 text-lg" />
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                          className={`${inputClass} pl-11 pr-12`} placeholder="Min 6 characters" minLength={6} required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-400">
                          {showPassword ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
                        </button>
                      </div>
                    </div>

                    {/* Student fields */}
                    <AnimatePresence>
                      {role === 'student' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">🏛️ Department</label>
                            <div className="relative">
                              <HiOutlineAcademicCap className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 text-lg" />
                              <select value={department} onChange={(e) => setDepartment(e.target.value)}
                                className={`${inputClass} pl-11`} required>
                                <option value="">Select Department</option>
                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">📅 Semester</label>
                              <select value={semester} onChange={(e) => setSemester(e.target.value)}
                                className={`${inputClass} px-4`} required>
                                <option value="">Select</option>
                                {semesters.map(s => <option key={s} value={s}>Sem {s}</option>)}
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">🪪 Roll No.</label>
                              <div className="relative">
                                <HiOutlineIdentification className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 text-base" />
                                <input type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)}
                                  className={`${inputClass} pl-9`} placeholder="21CS001" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button type="submit" disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
                      className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 py-4 text-sm font-black text-white shadow-[0_8px_30px_rgba(245,158,11,0.5)] disabled:opacity-60">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? '⏳ Creating character...' : <><span>🎉</span> Create My Character <span>→</span></>}
                      </span>
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sign in link */}
            <div className="mt-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-amber-500/10" />
              <span className="text-xs text-slate-600">Already a hero?</span>
              <div className="h-px flex-1 bg-amber-500/10" />
            </div>
            <Link to="/login">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/5 py-3 text-sm font-bold text-amber-400 transition hover:bg-amber-500/10">
                ⚔️ Sign In Instead
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
