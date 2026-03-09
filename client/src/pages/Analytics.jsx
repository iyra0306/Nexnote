import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineDocumentText,
  HiOutlineArrowDownCircle,
  HiOutlineEye,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import { useToast } from '../components/Toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/notes/stats`);
        setStats(data);
      } catch (error) {
        addToast(error.response?.data?.message || 'Failed to load statistics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-slate-400">Loading analytics...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">No data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50">Analytics</h1>
        <p className="text-sm text-slate-400">
          Track performance and engagement metrics
        </p>
      </motion.div>

      {/* Overview Stats */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <StatCard
          icon={HiOutlineDocumentText}
          title="Total Notes"
          value={stats.totalNotes}
          color="from-cyan-400 to-sky-500"
        />
        <StatCard
          icon={HiOutlineArrowDownCircle}
          title="Total Downloads"
          value={stats.totalDownloads}
          color="from-emerald-400 to-teal-500"
        />
        <StatCard
          icon={HiOutlineEye}
          title="Total Views"
          value={stats.totalViews}
          color="from-violet-400 to-purple-500"
        />
      </motion.section>

      {/* Top Notes */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-slate-50">Top Downloaded Notes</h2>
        <div className="rounded-2xl border border-white/10 bg-[#111827]/80 overflow-hidden shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
          <div className="divide-y divide-white/5">
            {stats.topNotes && stats.topNotes.length > 0 ? (
              stats.topNotes.map((note, i) => (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 font-semibold">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-100 truncate">{note.title}</p>
                    <p className="text-xs text-slate-400">{note.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-cyan-300">{note.downloads || 0}</p>
                    <p className="text-xs text-slate-500">downloads</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">
                No notes available yet
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Notes by Subject */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-slate-50">Notes by Subject</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.notesBySubject && stats.notesBySubject.length > 0 ? (
            stats.notesBySubject.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="rounded-2xl border border-white/10 bg-[#111827]/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <HiOutlineChartBar className="text-2xl text-cyan-300" />
                  <span className="text-2xl font-bold text-slate-50">{item.count}</span>
                </div>
                <p className="text-sm font-medium text-slate-300">{item._id}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {((item.count / stats.totalNotes) * 100).toFixed(1)}% of total
                </p>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full p-8 text-center text-sm text-slate-500 rounded-2xl border border-white/10 bg-[#111827]/80">
              No subject data available
            </div>
          )}
        </div>
      </motion.section>

      {/* Illustration Section */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-slate-900/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.9)]"
      >
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-semibold text-slate-50">Modern Notes Management</h3>
            <p className="text-sm text-slate-400">
              Track your notes performance with real-time analytics. Monitor downloads, views, and engagement metrics to understand what content resonates with students.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">
                Real-time tracking
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs border border-cyan-500/20">
                Engagement metrics
              </span>
              <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 text-xs border border-pink-500/20">
                Performance insights
              </span>
            </div>
          </div>
          <div className="flex-1 max-w-md">
            <img
              src="/Modern notes management illustration.png"
              alt="Modern notes management illustration"
              className="w-full h-auto object-contain rounded-2xl"
              onError={(e) => {
                e.target.src = "https://images.undraw.co/illustrations/analytics-dark.svg";
              }}
            />
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, translateY: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl"
    >
      <div
        className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${color} blur-3xl`}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300 shadow-[0_0_24px_rgba(56,189,248,0.35)] group-hover:bg-cyan-500/25">
            <Icon className="text-xl" />
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {title}
          </p>
        </div>
        <p className="text-3xl font-bold text-slate-50">{value}</p>
      </div>
    </motion.div>
  );
}
