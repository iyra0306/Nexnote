import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineDocumentText, HiOutlineCloudArrowUp, HiOutlineHeart,
  HiOutlineMegaphone, HiOutlineChartBar, HiOutlineSparkles,
  HiArrowRight, HiOutlineAcademicCap, HiOutlineFire,
  HiOutlineBolt, HiOutlineBookOpen, HiOutlineStar,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { notesAPI, announcementAPI } from '../api/api';

const greetings = ['Good morning', 'Good afternoon', 'Good evening'];
const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? greetings[0] : h < 18 ? greetings[1] : greetings[2];
};

export default function Dashboard() {
  const { user } = useAuth();
  const { onlineUsers, notifications } = useSocket();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, downloads: 0, favorites: 0 });
  const [recentNotes, setRecentNotes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, annRes] = await Promise.all([
          notesAPI.getAll(),
          announcementAPI.getAll(),
        ]);
        const notes = notesRes.data || [];
        setStats({
          total: notes.length,
          downloads: notes.reduce((a, n) => a + (n.downloads || 0), 0),
          favorites: notes.filter(n => n.isImportantForExam).length,
        });
        setRecentNotes(notes.slice(0, 4));
        setAnnouncements((annRes.data || []).slice(0, 3));
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const quickActions = [
    { label: 'View Notes', icon: HiOutlineDocumentText, color: 'from-indigo-500 to-purple-600', path: '/notes', desc: 'Browse all notes' },
    { label: 'Upload Notes', icon: HiOutlineCloudArrowUp, color: 'from-purple-500 to-pink-600', path: '/upload', desc: 'Share with students', roles: ['teacher', 'admin'] },
    { label: 'Announcements', icon: HiOutlineMegaphone, color: 'from-pink-500 to-rose-600', path: '/announcements', desc: 'Latest updates' },
    { label: 'Analytics', icon: HiOutlineChartBar, color: 'from-cyan-500 to-blue-600', path: '/analytics', desc: 'Track performance', roles: ['teacher', 'admin'] },
    { label: 'Favorites', icon: HiOutlineHeart, color: 'from-rose-500 to-orange-500', path: '/favorites', desc: 'Saved notes' },
    { label: 'Exam Mode', icon: HiOutlineFire, color: 'from-amber-500 to-orange-600', path: '/notes', desc: 'Exam prep notes' },
  ].filter(a => !a.roles || a.roles.includes(user?.role));

  const statCards = [
    { label: 'Total Notes', value: stats.total, icon: HiOutlineBookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Total Downloads', value: stats.downloads, icon: HiOutlineBolt, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { label: 'Exam Important', value: stats.favorites, icon: HiOutlineStar, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { label: 'Online Now', value: onlineUsers, icon: HiOutlineSparkles, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  ];

  return (
    <div className="space-y-8">

      {/* Hero Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/60 via-purple-900/60 to-pink-900/40 p-8 shadow-[0_24px_80px_rgba(99,102,241,0.2)]">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-pink-500/15 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                {onlineUsers} users online
              </span>
              {notifications.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs text-purple-400">
                  {notifications.length} new
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-slate-50">
              {getGreeting()},{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                {user?.name?.split(' ')[0] || 'there'}
              </span>
            </h1>
            <p className="text-slate-400 text-sm max-w-lg">
              {user?.role === 'teacher'
                ? `You have ${stats.total} notes uploaded. Keep sharing knowledge with your students!`
                : `${stats.total} notes available for ${user?.department || 'your'} department. Start studying smarter!`}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {user?.department && (
                <span className="rounded-full bg-indigo-500/15 border border-indigo-500/20 px-3 py-1 text-xs text-indigo-300">
                  {user.department}
                </span>
              )}
              {user?.semester && (
                <span className="rounded-full bg-purple-500/15 border border-purple-500/20 px-3 py-1 text-xs text-purple-300">
                  Semester {user.semester}
                </span>
              )}
              <span className="rounded-full bg-pink-500/15 border border-pink-500/20 px-3 py-1 text-xs text-pink-300 capitalize">
                {user?.role || 'student'}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <img src="/nexnote-logo.png" alt="NEXNOTE" className="h-24 w-auto opacity-80"
              onError={(e) => e.target.style.display = 'none'} />
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }} whileHover={{ scale: 1.03, translateY: -2 }}
            className={`rounded-2xl border ${s.border} ${s.bg} p-5 backdrop-blur`}>
            <div className="flex items-start justify-between">
              <div className={`rounded-xl ${s.bg} p-2.5`}>
                <s.icon className={`text-xl ${s.color}`} />
              </div>
              <span className={`text-2xl font-bold ${s.color}`}>{loading ? '...' : s.value}</span>
            </div>
            <p className="mt-3 text-xs font-medium text-slate-400">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
            <HiOutlineBolt className="text-purple-400" /> Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((action, i) => (
            <motion.button key={action.label} onClick={() => navigate(action.path)}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
              whileHover={{ scale: 1.05, translateY: -4 }} whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-left backdrop-blur transition-all hover:border-white/20 hover:bg-slate-800/60">
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} shadow-lg`}>
                <action.icon className="text-lg text-white" />
              </div>
              <p className="text-sm font-semibold text-slate-100">{action.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{action.desc}</p>
              <HiArrowRight className="absolute bottom-4 right-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Bottom Grid: Recent Notes + Announcements */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

        {/* Recent Notes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
              <HiOutlineDocumentText className="text-indigo-400" /> Recent Notes
            </h2>
            <button onClick={() => navigate('/notes')}
              className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors">
              View all <HiArrowRight className="text-sm" />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-16 rounded-2xl bg-slate-900/60 animate-pulse" />
              ))}
            </div>
          ) : recentNotes.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-8 text-center">
              <HiOutlineBookOpen className="mx-auto text-4xl text-slate-600 mb-3" />
              <p className="text-sm text-slate-500">No notes uploaded yet</p>
              {user?.role !== 'student' && (
                <button onClick={() => navigate('/upload')}
                  className="mt-3 text-xs text-purple-400 hover:text-purple-300">
                  Upload the first note →
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {recentNotes.map((note, i) => (
                <motion.div key={note._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }} whileHover={{ scale: 1.01 }}
                  onClick={() => navigate('/notes')}
                  className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-900/60 p-4 cursor-pointer hover:border-purple-500/30 hover:bg-slate-800/60 transition-all">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20">
                    <HiOutlineDocumentText className="text-xl text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">{note.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{note.subject}</span>
                      {note.department && (
                        <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">{note.department}</span>
                      )}
                      {note.isImportantForExam && (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">Exam</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-500">{new Date(note.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-600 mt-1">↓ {note.downloads || 0}</p>
                  </div>
                  <HiArrowRight className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Column: Announcements + Tips */}
        <div className="space-y-6">
          {/* Announcements */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
                <HiOutlineMegaphone className="text-pink-400" /> Announcements
              </h2>
              <button onClick={() => navigate('/announcements')}
                className="flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 transition-colors">
                View all <HiArrowRight className="text-sm" />
              </button>
            </div>

            {announcements.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 text-center">
                <HiOutlineMegaphone className="mx-auto text-3xl text-slate-600 mb-2" />
                <p className="text-xs text-slate-500">No announcements yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map((ann, i) => {
                  const colors = {
                    urgent: 'border-red-500/30 bg-red-500/5 text-red-400',
                    normal: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
                    info: 'border-green-500/30 bg-green-500/5 text-green-400',
                  };
                  return (
                    <motion.div key={ann._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className={`rounded-2xl border p-4 ${colors[ann.priority] || colors.normal}`}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-100 leading-snug">{ann.title}</p>
                        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs capitalize border ${colors[ann.priority] || colors.normal}`}>
                          {ann.priority}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-400 line-clamp-2">{ann.content}</p>
                      <p className="mt-2 text-xs text-slate-600">
                        {ann.createdBy?.name} · {new Date(ann.createdAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Study Tip Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineAcademicCap className="text-amber-400 text-xl" />
              <p className="text-sm font-semibold text-amber-300">Study Tip</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use <span className="text-amber-300 font-medium">Exam Mode</span> in View Notes to filter only exam-important content. Perfect for last-minute revision.
            </p>
            <button onClick={() => navigate('/notes')}
              className="mt-3 text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
              Try Exam Mode <HiArrowRight className="text-xs" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
