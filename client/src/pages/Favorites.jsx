import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineArrowDownTray, HiOutlineHeart, HiOutlineCalendarDays } from 'react-icons/hi2';
import { useToast } from '../components/Toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const FILE_EMOJI = { pdf: '📕', doc: '📘', docx: '📗' };

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading]     = useState(true);
  const { addToast } = useToast();

  useEffect(() => { fetchFavorites(); }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/users/favorites`, { headers: { Authorization: `Bearer ${token}` } });
      setFavorites(data);
    } catch (err) { addToast(err.response?.data?.message || 'Failed to load favorites', 'error'); }
    finally { setLoading(false); }
  };

  const handleRemoveFavorite = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/users/favorites/${noteId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setFavorites(prev => prev.filter(n => n._id !== noteId));
      addToast('💎 Removed from loot bag', 'success');
    } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  const handleDownload = async (note) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/notes/${note._id}/download`, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url; a.download = note.title; a.click();
      window.URL.revokeObjectURL(url);
      addToast('⬇️ Download started! +5 XP', 'success');
    } catch { addToast('Download failed', 'error'); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
        className="text-4xl">💎</motion.div>
      <p className="text-amber-400 font-bold animate-pulse">Loading your loot...</p>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💎</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-50">Saved Loot</h1>
            <p className="text-sm text-amber-600/70 font-semibold">Your bookmarked scrolls</p>
          </div>
          <div className="ml-auto flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-2">
            <span className="text-amber-400 font-black">{favorites.length}</span>
            <span className="text-xs text-amber-600">items</span>
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            className="col-span-full rounded-3xl border border-amber-500/10 bg-[#0d0d20] p-12 text-center space-y-4">
            <div className="text-6xl">💔</div>
            <p className="text-xl font-black text-slate-300">No Loot Yet!</p>
            <p className="text-sm text-slate-500">Start collecting scrolls by clicking the ❤️ on any note</p>
            <motion.button onClick={() => window.location.href = '/notes'}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="mx-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)]">
              📚 Browse Library
            </motion.button>
          </motion.div>
        ) : (
          favorites.map((note, i) => {
            const ext = (note.fileURL || '').split('.').pop()?.toLowerCase();
            const emoji = FILE_EMOJI[ext] || '📄';
            return (
              <motion.article key={note._id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.03, translateY: -4 }}
                className="group flex flex-col rounded-2xl border border-amber-500/10 bg-[#0f0f25] p-5 shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-all hover:border-amber-500/30 hover:shadow-[0_8px_40px_rgba(245,158,11,0.08)]">

                {/* Header */}
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 text-2xl flex-shrink-0">
                    {emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-slate-50">{note.title}</h3>
                    <p className="mt-0.5 text-xs text-slate-400">{note.subject}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {note.department && (
                        <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-400">{note.department}</span>
                      )}
                      {note.isImportantForExam && (
                        <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] text-amber-400">🎯 Exam</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xl">💎</span>
                </div>

                {/* Meta */}
                <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  {note.uploadedBy && (
                    <span>By <span className="text-slate-300 font-medium">{note.uploadedBy.name || note.uploadedBy.email}</span></span>
                  )}
                  {note.createdAt && (
                    <span className="inline-flex items-center gap-1">
                      <HiOutlineCalendarDays className="text-xs" />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <motion.button onClick={() => handleDownload(note)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2.5 text-xs font-black text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)]">
                    <HiOutlineArrowDownTray className="text-sm" />
                    Download +5XP
                  </motion.button>
                  <button onClick={() => handleRemoveFavorite(note._id)}
                    className="inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20">
                    <HiOutlineHeart className="text-sm" />
                  </button>
                </div>
              </motion.article>
            );
          })
        )}
      </div>
    </div>
  );
}
