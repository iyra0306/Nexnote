import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineDocumentText, HiOutlineCloudArrowUp, HiOutlineHeart,
  HiOutlineMegaphone, HiOutlineChartBar, HiArrowRight,
  HiOutlineFire, HiOutlineBolt, HiOutlineBookOpen,
  HiOutlineStar, HiOutlineTrophy, HiOutlineSparkles,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { notesAPI, announcementAPI } from '../api/api';

const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

const BADGES = [
  { id: 'uploader',   icon: '⚔️', label: 'Note Warrior',   desc: 'Uploaded 1+ notes',    color: 'from-orange-500/20 to-red-500/20',    border: 'border-orange-500/30' },
  { id: 'scholar',    icon: '📚', label: 'Scholar',         desc: 'Accessed 10+ notes',   color: 'from-blue-500/20 to-cyan-500/20',     border: 'border-blue-500/30' },
  { id: 'favorite',   icon: '💎', label: 'Collector',       desc: 'Saved 5+ favorites',   color: 'from-purple-500/20 to-pink-500/20',   border: 'border-purple-500/30' },
  { id: 'streak',     icon: '🔥', label: 'On Fire',         desc: '3-day streak',         color: 'from-amber-500/20 to-orange-500/20',  border: 'border-amber-500/30' },
];

const QUESTS = [
  { icon: '📤', label: 'Upload a Note',       xp: '+10 XP',  color: 'text-orange-400', done: false },
  { icon: '⬇️', label: 'Download a Note',     xp: '+5 XP',   color: 'text-cyan-400',   done: false },
  { icon: '⭐', label: 'Rate a Note',          xp: '+3 XP',   color: 'text-amber-400',  done: false },
  { icon: '💬', label: 'Comment on a Note',   xp: '+2 XP',   color: 'text-purple-400', done: false },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [stats, setStats]             = useState({ total: 0, downloads: 0, examNotes: 0 });
  const [recentNotes, setRecentNotes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]         = useState(true);

  const points = user?.points || 0;
  const streak = user?.streak || 1;

  useEffect(() => {
    (async () => {
      try {
        const [nRes, aRes] = await Promise.all([notesAPI.getAll(), announcementAPI.getAll()]);
        const notes = nRes.data || [];
        setStats({
          total:     notes.length,
          downloads: notes.reduce((a, n) => a + (n.downloads || 0), 0),
          examNotes: notes.filter(n => n.isImportantForExam).length,
        });
        setRecentNotes(notes.slice(0, 4));
        setAnnouncements((aRes.data || []).slice(0, 3));
      } catch { /* silent */ }
      finally { setLoading(false); }
    })();
  }, []);

  const quickActions = [
    { label: 'Note Library',  icon: HiOutlineDocumentText, color: 'from-indigo-500 to-purple-600', path: '/notes',         desc: 'Browse notes',       xp: '📚' },
    { label: 'Upload Quest',  icon: HiOutlineCloudArrowUp, color: 'from-amber-500 to-orange-600',  path: '/upload',        desc: '+10 XP per upload',  xp: '⚔️', roles: ['teacher','admin'] },
    { label: 'Guild Chat',    icon: HiOutlineMegaphone,    color: 'from-pink-500 to-rose-600',     path: '/announcements', desc: 'Latest updates',     xp: '📣' },
    { label: 'Stats Board',   icon: HiOutlineChartBar,     color: 'from-cyan-500 to-blue-600',     path: '/analytics',     desc: 'Track performance',  xp: '📊', roles: ['teacher','admin'] },
    { label: 'Saved Loot',    icon: HiOutlineHeart,        color: 'from-rose-500 to-orange-500',   path: '/favorites',     desc: 'Your collection',    xp: '💎' },
    { label: 'Exam Mode 🎯',  icon: HiOutlineFire,         color: 'from-amber-500 to-yellow-500',  path: '/notes',         desc: 'Exam prep notes',    xp: '🔥' },
  ].filter(a => !a.roles || a.roles.includes(user?.role));

  const statCards = [
    { label: 'Total Notes',    value: stats.total,     icon: HiOutlineBookOpen,    color: 'text-purple-400', bg: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/20', emoji: '📚' },
    { label: 'Downloads',      value: stats.downloads, icon: HiOutlineBolt,        color: 'text-cyan-400',   bg: 'from-cyan-500/10 to-cyan-500/5',     border: 'border-cyan-500/20',   emoji: '⚡' },
    { label: 'Exam Notes',     value: stats.examNotes, icon: HiOutlineStar,        color: 'text-amber-400',  bg: 'from-amber-500/10 to-amber-500/5',   border: 'border-amber-500/20',  emoji: '🎯' },
    { label: 'Your XP',        value: points,          icon: HiOutlineTrophy,      color: 'text-orange-400', bg: 'from-orange-500/10 to-orange-500/5', border: 'border-orange-500/20', emoji: '🏆' },
  ];

  return (
    <div className="space-y-6">

      {/* ── HERO BANNER ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#1a1200] via-[#1a0d00] to-[#0d0d20] p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.1)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-400 font-semibold">
                <HiOutlineFire className="text-amber-400" /> {streak}-Day Streak
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-400 font-semibold">
                🏆 {points} XP Total
              </span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-amber-600/70 mb-1">{getGreeting()}, Player!</p>
              <h1 className="text-3xl font-black text-slate-50">
                Welcome back,{' '}
                <span className="gradient-text-gold">{user?.name?.split(' ')[0] || 'Hero'}</span>
                <span className="ml-2">⚔️</span>
              </h1>
            </div>
            <p className="text-slate-400 text-sm max-w-lg">
              {user?.role === 'teacher'
                ? `You've uploaded ${stats.total} notes. Keep sharing knowledge and earning XP!`
                : `${stats.total} notes await in the library. Study hard, level up fast!`}
            </p>
            <div className="flex flex-wrap gap-2">
              {user?.department && (
                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-300 font-medium">
                  🏛️ {user.department}
                </span>
              )}
              {user?.semester && (
                <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-300 font-medium">
                  📅 Semester {user.semester}
                </span>
              )}
              <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-300 font-medium capitalize">
                🎭 {user?.role || 'student'}
              </span>
            </div>
          </div>

          {/* XP Ring */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="absolute inset-0 rank-ring" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(245,158,11,0.1)" strokeWidth="6" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#xpGrad)" strokeWidth="6"
                  strokeDasharray={`${2.83 * (user?.points || 0) % 283} 283`}
                  strokeLinecap="round" transform="rotate(-90 50 50)" />
                <defs>
                  <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-center">
                <p className="text-2xl font-black text-amber-400">{points}</p>
                <p className="text-[10px] text-amber-600 font-semibold">XP</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-300">🔥 {streak} Day Streak</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── STAT CARDS ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }} whileHover={{ scale: 1.04, translateY: -3 }}
            className={`rounded-2xl border ${s.border} bg-gradient-to-br ${s.bg} p-5 backdrop-blur cursor-default`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{s.emoji}</span>
              <span className={`text-2xl font-black ${s.color}`}>{loading ? '…' : s.value}</span>
            </div>
            <p className="text-xs font-semibold text-slate-400">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── QUICK ACTIONS ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="space-y-3">
        <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <HiOutlineBolt className="text-amber-400" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((a, i) => (
            <motion.button key={a.label} onClick={() => navigate(a.path)}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
              whileHover={{ scale: 1.06, translateY: -4 }} whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0f0f25] p-4 text-left transition-all hover:border-amber-500/30 quest-card">
              <div className={`absolute inset-0 bg-gradient-to-br ${a.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${a.color} shadow-lg`}>
                <a.icon className="text-lg text-white" />
              </div>
              <p className="text-xs font-bold text-slate-100 leading-tight">{a.label}</p>
              <p className="mt-1 text-[10px] text-amber-500 font-semibold">{a.xp} {a.desc}</p>
              <HiArrowRight className="absolute bottom-3 right-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── DAILY QUESTS + BADGES ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Daily Quests */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="space-y-3">
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <HiOutlineFire className="text-orange-400" /> Daily Quests
          </h2>
          <div className="rounded-2xl border border-amber-500/10 bg-[#0f0f25] overflow-hidden">
            {QUESTS.map((q, i) => (
              <div key={i} className={`flex items-center gap-4 px-4 py-3 ${i < QUESTS.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors`}>
                <span className="text-xl">{q.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-200">{q.label}</p>
                </div>
                <span className={`text-xs font-bold ${q.color} rounded-full border border-current/30 bg-current/10 px-2 py-0.5`}>
                  {q.xp}
                </span>
                <div className="h-5 w-5 rounded-full border-2 border-slate-600 flex items-center justify-center">
                  {q.done && <span className="text-green-400 text-xs">✓</span>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="space-y-3">
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <HiOutlineShieldCheck className="text-purple-400" /> Achievement Badges
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {BADGES.map((b, i) => (
              <motion.div key={b.id} whileHover={{ scale: 1.04 }}
                className={`rounded-2xl border ${b.border} bg-gradient-to-br ${b.color} p-4 text-center`}>
                <span className="text-3xl block mb-2">{b.icon}</span>
                <p className="text-xs font-bold text-slate-200">{b.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── RECENT NOTES + ANNOUNCEMENTS ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

        {/* Recent Notes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <HiOutlineDocumentText className="text-indigo-400" /> Recent Notes
            </h2>
            <button onClick={() => navigate('/notes')}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors font-semibold">
              View all <HiArrowRight className="text-xs" />
            </button>
          </div>
          {loading ? (
            <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-16 rounded-2xl bg-[#0f0f25] animate-pulse" />)}</div>
          ) : recentNotes.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-[#0f0f25] p-8 text-center">
              <span className="text-4xl block mb-3">📭</span>
              <p className="text-sm text-slate-500">No notes yet. Be the first hero to upload!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentNotes.map((note, i) => (
                <motion.div key={note._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }} whileHover={{ scale: 1.01 }}
                  onClick={() => navigate('/notes')}
                  className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-[#0f0f25] p-4 cursor-pointer hover:border-amber-500/20 hover:bg-[#141428] transition-all">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 text-xl">
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">{note.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{note.subject}</span>
                      {note.department && <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">{note.department}</span>}
                      {note.isImportantForExam && <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">🎯 Exam</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-500">{new Date(note.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-amber-600 mt-1">⬇️ {note.downloads || 0}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Announcements + Study Tip */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <HiOutlineMegaphone className="text-pink-400" /> Guild Chat
              </h2>
              <button onClick={() => navigate('/announcements')}
                className="flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 transition-colors font-semibold">
                View all <HiArrowRight className="text-xs" />
              </button>
            </div>
            {announcements.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-[#0f0f25] p-6 text-center">
                <span className="text-3xl block mb-2">📭</span>
                <p className="text-xs text-slate-500">No announcements yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {announcements.map((ann, i) => {
                  const c = { urgent: 'border-red-500/30 bg-red-500/5 text-red-400', normal: 'border-blue-500/30 bg-blue-500/5 text-blue-400', info: 'border-green-500/30 bg-green-500/5 text-green-400' };
                  return (
                    <div key={ann._id} className={`rounded-2xl border p-4 ${c[ann.priority] || c.normal}`}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-slate-100">{ann.title}</p>
                        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] capitalize border ${c[ann.priority] || c.normal}`}>{ann.priority}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2">{ann.content}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Study Tip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">💡</span>
              <p className="text-sm font-bold text-amber-300">Pro Tip</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use <span className="text-amber-300 font-bold">🎯 Exam Mode</span> to filter only exam-important notes. Perfect for last-minute revision and earning bonus XP!
            </p>
            <button onClick={() => navigate('/notes')}
              className="mt-3 text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold">
              Try Exam Mode <HiArrowRight className="text-xs" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
