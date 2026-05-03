import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineTrophy, HiOutlineFire, HiOutlineBolt, HiOutlineEye } from 'react-icons/hi2';
import { useToast } from '../components/Toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const RANK_MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

export default function Analytics() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/notes/stats`);
        setStats(data);
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to load stats', 'error');
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="text-4xl">📊</motion.div>
      <p className="text-amber-400 font-bold animate-pulse">Loading Stats Board...</p>
    </div>
  );

  if (!stats) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-slate-400">No data available</p>
    </div>
  );

  const statCards = [
    { emoji: '📚', label: 'Total Scrolls',   value: stats.totalNotes,     color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/30', text: 'text-purple-400' },
    { emoji: '⬇️', label: 'Total Downloads', value: stats.totalDownloads, color: 'from-cyan-500/20 to-cyan-500/5',     border: 'border-cyan-500/30',   text: 'text-cyan-400' },
    { emoji: '👁️', label: 'Total Views',     value: stats.totalViews,     color: 'from-amber-500/20 to-amber-500/5',   border: 'border-amber-500/30',  text: 'text-amber-400' },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-50">Stats Board</h1>
            <p className="text-sm text-amber-600/70 font-semibold">Track your guild's performance</p>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid gap-5 sm:grid-cols-3">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.08 }} whileHover={{ scale: 1.04, translateY: -4 }}
            className={`rounded-2xl border ${s.border} bg-gradient-to-br ${s.color} p-6`}>
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{s.emoji}</span>
              <span className={`text-3xl font-black ${s.text}`}>{s.value}</span>
            </div>
            <p className="text-sm font-bold text-slate-300">{s.label}</p>
            {/* Mini bar */}
            <div className="mt-3 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                className={`h-full rounded-full bg-gradient-to-r ${s.color.replace('/20', '').replace('/5', '')}`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Leaderboard */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="space-y-4">
        <div className="flex items-center gap-2">
          <HiOutlineTrophy className="text-amber-400 text-xl" />
          <h2 className="text-lg font-black text-slate-50">🏆 Top Downloaded Scrolls</h2>
        </div>
        <div className="rounded-2xl border border-amber-500/10 bg-[#0d0d20] overflow-hidden">
          {stats.topNotes && stats.topNotes.length > 0 ? (
            stats.topNotes.map((note, i) => (
              <motion.div key={note._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors ${i < stats.topNotes.length - 1 ? 'border-b border-white/5' : ''}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-black flex-shrink-0 ${
                  i === 0 ? 'bg-amber-500/20 border border-amber-500/40' :
                  i === 1 ? 'bg-slate-400/20 border border-slate-400/40' :
                  i === 2 ? 'bg-orange-700/20 border border-orange-700/40' :
                  'bg-white/5 border border-white/10'
                }`}>
                  {RANK_MEDALS[i]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-100 truncate">{note.title}</p>
                  <p className="text-xs text-slate-500">{note.subject}</p>
                  {/* Download bar */}
                  <div className="mt-1.5 h-1 rounded-full bg-slate-800 overflow-hidden w-full max-w-[200px]">
                    <motion.div initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, ((note.downloads || 0) / (stats.topNotes[0]?.downloads || 1)) * 100)}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-black text-amber-400">{note.downloads || 0}</p>
                  <p className="text-[10px] text-slate-500">downloads</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center">
              <span className="text-4xl block mb-3">📭</span>
              <p className="text-sm text-slate-500">No scrolls uploaded yet</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Notes by Subject */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="space-y-4">
        <div className="flex items-center gap-2">
          <HiOutlineFire className="text-orange-400 text-xl" />
          <h2 className="text-lg font-black text-slate-50">📖 Scrolls by Subject</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.notesBySubject && stats.notesBySubject.length > 0 ? (
            stats.notesBySubject.map((item, i) => (
              <motion.div key={item._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }} whileHover={{ scale: 1.04 }}
                className="rounded-2xl border border-amber-500/10 bg-[#0d0d20] p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">📖</span>
                  <span className="text-2xl font-black text-amber-400">{item.count}</span>
                </div>
                <p className="text-sm font-bold text-slate-300">{item._id}</p>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Coverage</span>
                    <span>{((item.count / stats.totalNotes) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div initial={{ width: 0 }}
                      animate={{ width: `${(item.count / stats.totalNotes) * 100}%` }}
                      transition={{ delay: 0.6 + i * 0.05, duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full p-12 text-center rounded-2xl border border-amber-500/10 bg-[#0d0d20]">
              <span className="text-4xl block mb-3">📭</span>
              <p className="text-sm text-slate-500">No subject data yet</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Illustration */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-3xl border border-amber-500/10 bg-gradient-to-br from-[#0d0d20] to-[#0a0a1a] p-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-black text-slate-50">⚔️ Guild Performance</h3>
            <p className="text-sm text-slate-400">Track your guild's knowledge sharing. Every upload earns XP, every download spreads wisdom!</p>
            <div className="flex flex-wrap gap-2">
              {['📊 Real-time tracking', '⚡ XP rewards', '🏆 Leaderboards'].map(t => (
                <span key={t} className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20 font-semibold">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex-1 max-w-md">
            <img src="/Modern notes management illustration.png" alt="Analytics" className="w-full h-auto object-contain rounded-2xl opacity-80"
              onError={(e) => e.target.style.display='none'} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
