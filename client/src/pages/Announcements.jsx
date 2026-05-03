import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiOutlineMegaphone } from 'react-icons/hi2';
import { announcementAPI } from '../api/api';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const departments = ['All', 'CSE', 'ECE', 'Mechanical', 'Civil', 'IT', 'EEE', 'Chemical', 'Biotechnology'];
const semesters   = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const PRIORITY_CONFIG = {
  urgent: { emoji: '🚨', label: 'URGENT',  border: 'border-red-500/40',    bg: 'from-red-500/15 to-red-500/5',    text: 'text-red-300',    badge: 'bg-red-500/20 text-red-300 border-red-500/30' },
  normal: { emoji: '📢', label: 'NORMAL',  border: 'border-amber-500/40',  bg: 'from-amber-500/15 to-amber-500/5', text: 'text-amber-300',  badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  info:   { emoji: '💡', label: 'INFO',    border: 'border-blue-500/40',   bg: 'from-blue-500/15 to-blue-500/5',  text: 'text-blue-300',   badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [showForm, setShowForm]           = useState(false);
  const [title, setTitle]                 = useState('');
  const [content, setContent]             = useState('');
  const [department, setDepartment]       = useState('All');
  const [semester, setSemester]           = useState(0);
  const [priority, setPriority]           = useState('normal');
  const { addToast } = useToast();
  const { user }     = useAuth();

  const canPost = user?.role === 'teacher' || user?.role === 'admin';

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await announcementAPI.getAll();
      setAnnouncements(data);
    } catch (err) { addToast(err.response?.data?.message || 'Failed to load', 'error'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await announcementAPI.create({ title, content, department, semester, priority });
      addToast('📣 Announcement posted! +5 XP', 'success');
      setTitle(''); setContent(''); setDepartment('All'); setSemester(0); setPriority('normal');
      setShowForm(false);
      fetchAnnouncements();
    } catch (err) { addToast(err.response?.data?.message || 'Failed to create', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await announcementAPI.delete(id);
      setAnnouncements(prev => prev.filter(a => a._id !== id));
      addToast('Deleted', 'success');
    } catch (err) { addToast(err.response?.data?.message || 'Delete failed', 'error'); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
        className="text-4xl">📣</motion.div>
      <p className="text-amber-400 font-bold animate-pulse">Loading Guild Chat...</p>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📣</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-50">Guild Chat</h1>
            <p className="text-sm text-amber-600/70 font-semibold">Important updates from your guild masters</p>
          </div>
        </div>
        {canPost && (
          <motion.button onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`px-4 py-2.5 rounded-xl text-sm font-black transition-all ${
              showForm
                ? 'border border-red-500/30 bg-red-500/10 text-red-400'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)]'
            }`}>
            {showForm ? '✕ Cancel' : '📣 Post Announcement +5XP'}
          </motion.button>
        )}
      </motion.div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, y: -20, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }} onSubmit={handleCreate}
            className="rounded-3xl border border-amber-500/20 bg-[#0d0d20] p-6 space-y-4 overflow-hidden">
            <h3 className="text-base font-black text-amber-400 flex items-center gap-2">
              <HiOutlineMegaphone /> New Guild Announcement
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">📌 Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-amber-500/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 placeholder:text-slate-600"
                placeholder="Announcement title..." required />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">📝 Content</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4}
                className="w-full rounded-xl border border-amber-500/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 resize-none placeholder:text-slate-600"
                placeholder="Write your announcement..." required />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: '🏛️ Department', value: department, onChange: setDepartment, options: departments.map(d => ({ value: d, label: d })) },
                { label: '📅 Semester',   value: semester,   onChange: (v) => setSemester(parseInt(v)), options: [{ value: 0, label: 'All Semesters' }, ...semesters.slice(1).map(s => ({ value: s, label: `Semester ${s}` }))] },
                { label: '⚡ Priority',   value: priority,   onChange: setPriority, options: [{ value: 'info', label: '💡 Info' }, { value: 'normal', label: '📢 Normal' }, { value: 'urgent', label: '🚨 Urgent' }] },
              ].map(({ label, value, onChange, options }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">{label}</label>
                  <select value={value} onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-xl border border-amber-500/20 bg-slate-950/60 px-3 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-500">
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-black text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.6)] transition-all">
              📣 Post to Guild +5 XP
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-amber-500/10 bg-[#0d0d20] p-12 text-center space-y-4">
            <div className="text-6xl">📭</div>
            <p className="text-xl font-black text-slate-300">No Guild Announcements Yet</p>
            <p className="text-sm text-slate-500">Guild masters haven't posted anything yet. Check back soon!</p>
          </motion.div>
        ) : (
          announcements.map((ann, i) => {
            const cfg = PRIORITY_CONFIG[ann.priority] || PRIORITY_CONFIG.normal;
            return (
              <motion.div key={ann._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.01 }}
                className={`rounded-2xl border ${cfg.border} bg-gradient-to-r ${cfg.bg} p-5`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border ${cfg.badge} text-2xl`}>
                      {cfg.emoji}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-base font-black ${cfg.text}`}>{ann.title}</h3>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{ann.content}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold">
                        <span>🏛️ {ann.department}</span>
                        {ann.semester > 0 && <span>📅 Semester {ann.semester}</span>}
                        <span>👤 {ann.createdBy?.name || 'Guild Master'}</span>
                        <span>📅 {new Date(ann.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {canPost && (
                    <button onClick={() => handleDelete(ann._id)}
                      className="p-2 rounded-xl hover:bg-red-500/20 transition-colors text-slate-500 hover:text-red-400 flex-shrink-0">
                      <HiXMark className="text-xl" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
