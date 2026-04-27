import { useState } from 'react';
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

const departments = ['CSE', 'ECE', 'Mechanical', 'Civil', 'IT', 'EEE', 'Chemical', 'Biotechnology', 'Other'];
const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.signup(name, email, password, role,
        role === 'student' ? department : undefined,
        role === 'student' ? semester : undefined,
        role === 'student' ? rollNumber : undefined);
      login(data);
      addToast('Account created! Welcome to NEXNOTE 🎉', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-white/10 bg-slate-950/60 py-3.5 text-sm text-slate-100 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 placeholder:text-slate-600";

  return (
    <div className="relative flex min-h-screen bg-[#020617] text-slate-100 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />
        <motion.div animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-pink-600/15 blur-[120px]" />
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative space-y-8">
        <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-12 w-auto" onError={(e) => e.target.style.display='none'} />
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-50">
            Join <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">NEXNOTE</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Create your account and start accessing organized study materials for your department and semester.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-600">Choose your role</p>
          {[
            { r: 'student', emoji: '🎓', title: 'Student', desc: 'Access notes, download, rate and comment' },
            { r: 'teacher', emoji: '👨‍🏫', title: 'Teacher', desc: 'Upload notes, post announcements, view analytics' },
          ].map(({ r, emoji, title, desc }) => (
            <motion.div key={r} whileHover={{ scale: 1.02 }}
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${role === r ? 'border-purple-500/50 bg-purple-500/10' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
              onClick={() => setRole(r)}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-100">{title}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
                {role === r && <div className="ml-auto h-5 w-5 rounded-full bg-purple-500 flex items-center justify-center"><span className="text-white text-xs">✓</span></div>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-6 flex justify-center lg:hidden">
            <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-12 w-auto" onError={(e) => e.target.style.display='none'} />
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-[0_32px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
            <div className="mb-6 space-y-1">
              <h2 className="text-2xl font-bold text-slate-50">Create account ✨</h2>
              <p className="text-sm text-slate-400">Join thousands of students on NEXNOTE</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Full Name</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className={`${inputClass} pl-11`} placeholder="Your full name" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Email</label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className={`${inputClass} pl-11`} placeholder="you@chitkara.edu.in" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pl-11 pr-12`} placeholder="Min 6 characters" minLength={6} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPassword ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
                  </button>
                </div>
              </div>

              {/* Role toggle mobile */}
              <div className="space-y-1.5 lg:hidden">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  {['student', 'teacher'].map((r) => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={`py-3 rounded-xl text-sm font-medium capitalize transition-all ${role === r ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-purple-300 border-2 border-purple-500/40' : 'bg-slate-950/40 text-slate-400 border border-white/10 hover:bg-white/5'}`}>
                      {r === 'student' ? '🎓' : '👨‍🏫'} {r}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {role === 'student' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Department</label>
                      <div className="relative">
                        <HiOutlineAcademicCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                        <select value={department} onChange={(e) => setDepartment(e.target.value)}
                          className={`${inputClass} pl-11`} required={role === 'student'}>
                          <option value="">Select Department</option>
                          {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Semester</label>
                        <select value={semester} onChange={(e) => setSemester(e.target.value)}
                          className={`${inputClass} px-4`} required={role === 'student'}>
                          <option value="">Select</option>
                          {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Roll No.</label>
                        <div className="relative">
                          <HiOutlineIdentification className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
                          <input type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)}
                            className={`${inputClass} pl-9`} placeholder="21CS001" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_rgba(139,92,246,0.5)] transition-all hover:shadow-[0_8px_40px_rgba(139,92,246,0.7)] disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? 'Creating account...' : 'Create Account →'}
              </motion.button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-xs text-slate-600">Already have an account?</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <Link to="/login">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10">
                Sign in instead
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
