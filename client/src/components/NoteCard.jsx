import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineArrowDownTray, HiOutlineTrash, HiOutlineCalendarDays,
  HiOutlineHeart, HiHeart, HiOutlineChatBubbleLeft,
  HiOutlineEye, HiOutlineArrowDownCircle,
} from 'react-icons/hi2';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import NoteMessage from './NoteMessage';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const FILE_EMOJI = { pdf: '📕', doc: '📘', docx: '📗' };

export default function NoteCard({ note, onDelete, onUpdate }) {
  const { user, syncPoints, refreshUser } = useAuth();
  const { addToast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment]     = useState('');
  const [isFavorite, setIsFavorite]     = useState(false);
  const [localNote, setLocalNote]       = useState(note);
  const [downloading, setDownloading]   = useState(false);
  const [xpPop, setXpPop]               = useState(null);

  const canDelete = user?.role === 'admin' || user?.role === 'teacher';
  const ext = (localNote.fileURL || '').split('.').pop()?.toLowerCase();
  const fileEmoji = FILE_EMOJI[ext] || '📄';

  const showXP = (msg) => {
    setXpPop(msg);
    setTimeout(() => setXpPop(null), 1500);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await axios.get(`${API_URL}/notes/${note._id}/download`, {
        headers: { Authorization: `Bearer ${token}` }, responseType: 'blob',
      });
      const url = window.URL.createObjectURL(res.data);
      const a   = document.createElement('a');
      a.href = url; a.download = note.title; a.click();
      window.URL.revokeObjectURL(url);
      addToast('Download started! +5 XP', 'success');
      showXP('+5 XP');
      // Award +5 XP locally (server tracks downloads but doesn't award XP for downloads)
      const stored = JSON.parse(localStorage.getItem('nexnote_user') || '{}');
      if (stored.points !== undefined) syncPoints((stored.points || 0) + 5);
    } catch { addToast('Download failed', 'error'); }
    finally { setDownloading(false); }
  };

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/users/favorites/${note._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setIsFavorite(data.isFavorite);
      addToast(data.isFavorite ? '💎 Added to loot! +2 XP' : 'Removed from loot', 'success');
      if (data.isFavorite) showXP('+2 XP');
    } catch { addToast('Failed to update favorites', 'error'); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/notes/${note._id}/comments`, { text: newComment }, { headers: { Authorization: `Bearer ${token}` } });
      setLocalNote(data); setNewComment('');
      addToast('Comment posted! +2 XP', 'success');
      showXP('+2 XP');
      if (data._userPoints !== undefined) syncPoints(data._userPoints);
      if (onUpdate) onUpdate(data);
    } catch (err) { addToast(err.response?.data?.message || 'Failed to add comment', 'error'); }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/notes/${note._id}/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });
      setLocalNote({ ...localNote, comments: localNote.comments.filter(c => c._id !== commentId) });
      addToast('Comment deleted', 'success');
    } catch { addToast('Failed to delete comment', 'error'); }
  };

  const handleRate = async (rating) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/notes/${note._id}/ratings`, { rating }, { headers: { Authorization: `Bearer ${token}` } });
      setLocalNote({ ...localNote, averageRating: data.averageRating });
      addToast('Rating submitted! +3 XP', 'success');
      showXP('+3 XP');
      if (data._userPoints !== undefined) syncPoints(data._userPoints);
    } catch { addToast('Failed to submit rating', 'error'); }
  };

  return (
    <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, translateY: -4 }}
      className="group relative flex flex-col rounded-2xl border border-white/5 bg-[#0f0f25] p-5 shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-all hover:border-amber-500/20 hover:shadow-[0_8px_40px_rgba(245,158,11,0.08)]">

      {/* XP Pop */}
      <AnimatePresence>
        {xpPop && (
          <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -40 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute top-2 right-2 z-10 rounded-full bg-amber-500 px-3 py-1 text-xs font-black text-white shadow-gold pointer-events-none">
            {xpPop}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exam badge */}
      {localNote.isImportantForExam && (
        <div className="absolute -top-2 -right-2 z-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2 py-0.5 text-[10px] font-black text-white shadow-gold">
          🎯 EXAM
        </div>
      )}

      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 text-2xl flex-shrink-0">
          {fileEmoji}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-50">{localNote.title}</h3>
          <p className="mt-0.5 text-xs text-slate-400">{localNote.subject}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {localNote.department && (
              <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-400">
                {localNote.department}
              </span>
            )}
            {localNote.semester && (
              <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] text-purple-400">
                Sem {localNote.semester}
              </span>
            )}
            {localNote.examTags?.map(tag => (
              <span key={tag} className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] text-amber-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button onClick={handleToggleFavorite} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0">
          {isFavorite
            ? <HiHeart className="text-lg text-red-400" />
            : <HiOutlineHeart className="text-lg text-slate-500 hover:text-red-400 transition-colors" />}
        </button>
      </div>

      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={localNote.averageRating || 0} onRate={handleRate} size="sm" />
      </div>

      {/* Meta */}
      <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
        {localNote.uploadedBy && (
          <span>By <span className="text-slate-300 font-medium">{localNote.uploadedBy.name || localNote.uploadedBy.email}</span></span>
        )}
        {localNote.createdAt && (
          <span className="inline-flex items-center gap-1">
            <HiOutlineCalendarDays className="text-xs" />
            {new Date(localNote.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="mb-4 flex gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1"><HiOutlineEye className="text-sm" />{localNote.views || 0}</span>
        <span className="inline-flex items-center gap-1"><HiOutlineArrowDownCircle className="text-sm" />{localNote.downloads || 0}</span>
        <span className="inline-flex items-center gap-1"><HiOutlineChatBubbleLeft className="text-sm" />{localNote.comments?.length || 0}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-3">
        <motion.button type="button" onClick={handleDownload} disabled={downloading}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2.5 text-xs font-bold text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)] transition-all hover:shadow-[0_4px_30px_rgba(245,158,11,0.6)] disabled:opacity-60">
          <HiOutlineArrowDownTray className="text-sm" />
          {downloading ? 'Downloading…' : 'Download +5XP'}
        </motion.button>
        {canDelete && (
          <button type="button" onClick={() => onDelete(note._id)}
            className="inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20">
            <HiOutlineTrash className="text-sm" />
          </button>
        )}
      </div>

      {/* Message Uploader */}
      <div className="mb-2">
        <NoteMessage note={localNote} />
      </div>

      {/* Comments toggle */}
      <button onClick={() => setShowComments(!showComments)}
        className="text-xs text-amber-400 hover:text-amber-300 transition-colors text-left font-semibold flex items-center gap-1">
        <HiOutlineChatBubbleLeft className="text-sm" />
        {showComments ? 'Hide' : 'Show'} comments ({localNote.comments?.length || 0})
      </button>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="mt-4 space-y-3 border-t border-white/5 pt-4 overflow-hidden">
            <form onSubmit={handleAddComment} className="space-y-2">
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment... (+2 XP)" rows={2}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 resize-none placeholder:text-slate-600" />
              <button type="submit" disabled={!newComment.trim()}
                className="w-full rounded-xl bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-colors disabled:opacity-50">
                Post Comment +2 XP
              </button>
            </form>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {localNote.comments?.map((c) => (
                <div key={c._id} className="rounded-xl bg-slate-950/60 border border-white/5 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-300">{c.user?.name || 'Anonymous'}</p>
                      <p className="text-xs text-slate-400 mt-1">{c.text}</p>
                    </div>
                    {(user?._id === c.user?._id || user?.role === 'admin') && (
                      <button onClick={() => handleDeleteComment(c._id)} className="text-xs text-red-400 hover:text-red-300">✕</button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">{new Date(c.createdAt).toLocaleString()}</p>
                </div>
              ))}
              {(!localNote.comments || localNote.comments.length === 0) && (
                <p className="text-xs text-slate-500 text-center py-3">No comments yet. Be the first! 💬</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
