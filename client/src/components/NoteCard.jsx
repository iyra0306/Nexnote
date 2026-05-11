import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineArrowDownTray, HiOutlineTrash, HiOutlineCalendarDays,
  HiOutlineHeart, HiHeart, HiOutlineChatBubbleLeft,
  HiOutlineEye, HiOutlineArrowDownCircle, HiOutlineStar,
} from 'react-icons/hi2';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import NoteMessage from './NoteMessage';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const FILE_CONFIG = {
  pdf:  { emoji: '📕', color: '#db2777', bg: 'rgba(219,39,119,0.1)',  border: 'rgba(219,39,119,0.25)' },
  doc:  { emoji: '📘', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)',  border: 'rgba(124,58,237,0.25)' },
  docx: { emoji: '📗', color: '#059669', bg: 'rgba(5,150,105,0.1)',   border: 'rgba(5,150,105,0.25)' },
};

export default function NoteCard({ note, onDelete, onUpdate }) {
  const { user, syncPoints } = useAuth();
  const { addToast }         = useToast();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment]     = useState('');
  const [isFavorite, setIsFavorite]     = useState(false);
  const [localNote, setLocalNote]       = useState(note);
  const [downloading, setDownloading]   = useState(false);
  const [xpPop, setXpPop]               = useState(null);

  const canDelete = user?.role === 'admin' || user?.role === 'teacher';
  const ext       = (localNote.fileURL || '').split('.').pop()?.toLowerCase();
  const cfg       = FILE_CONFIG[ext] || FILE_CONFIG.doc;

  const showXP = (msg) => { setXpPop(msg); setTimeout(() => setXpPop(null), 1500); };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await axios.get(`${API_URL}/notes/${note._id}/download`, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });
      const url   = window.URL.createObjectURL(res.data);
      const a     = document.createElement('a');
      a.href = url; a.download = note.title; a.click();
      window.URL.revokeObjectURL(url);
      addToast('Download started! +5 XP', 'success');
      showXP('+5 XP');
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
      addToast(data.isFavorite ? 'Added to favorites! +2 XP' : 'Removed', 'success');
      if (data.isFavorite) showXP('+2 XP');
    } catch { addToast('Failed', 'error'); }
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
    } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/notes/${note._id}/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });
      setLocalNote({ ...localNote, comments: localNote.comments.filter(c => c._id !== commentId) });
      addToast('Deleted', 'success');
    } catch { addToast('Failed', 'error'); }
  };

  const handleRate = async (rating) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/notes/${note._id}/ratings`, { rating }, { headers: { Authorization: `Bearer ${token}` } });
      setLocalNote({ ...localNote, averageRating: data.averageRating });
      addToast('Rated! +3 XP', 'success');
      showXP('+3 XP');
      if (data._userPoints !== undefined) syncPoints(data._userPoints);
    } catch { addToast('Failed', 'error'); }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-2xl overflow-hidden transition-all duration-300 card-hover"
      style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.07)' }}>

      {/* Left color accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}44)` }} />

      {/* XP Pop */}
      <AnimatePresence>
        {xpPop && (
          <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -40 }}
            exit={{ opacity: 0 }} transition={{ duration: 1 }}
            className="absolute top-3 right-3 z-20 rounded-full px-3 py-1 text-xs font-black text-white pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}>
            {xpPop}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pl-5 pr-5 pt-5 pb-4">
        {/* Header row */}
        <div className="flex items-start gap-4">
          {/* File icon */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            {cfg.emoji}
          </div>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{localNote.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{localNote.subject}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {localNote.isImportantForExam && (
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}>
                    🎯 EXAM
                  </span>
                )}
                <button onClick={handleToggleFavorite} className="p-1 rounded-lg hover:bg-white/5 transition-all">
                  {isFavorite
                    ? <HiHeart className="text-base" style={{ color: '#db2777' }} />
                    : <HiOutlineHeart className="text-base text-slate-600 hover:text-[#db2777] transition-colors" />}
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {localNote.department && (
                <span className="tag" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa' }}>
                  {localNote.department}
                </span>
              )}
              {localNote.semester && (
                <span className="tag" style={{ background: 'rgba(8,145,178,0.12)', border: '1px solid rgba(8,145,178,0.2)', color: '#67e8f9' }}>
                  Sem {localNote.semester}
                </span>
              )}
              {localNote.examTags?.map(t => (
                <span key={t} className="tag" style={{ background: 'rgba(219,39,119,0.1)', border: '1px solid rgba(219,39,119,0.2)', color: '#f9a8d4' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Rating + stats row */}
        <div className="flex items-center justify-between mt-4">
          <StarRating rating={localNote.averageRating || 0} onRate={handleRate} size="sm" />
          <div className="flex items-center gap-3 text-[11px] text-slate-600">
            <span className="flex items-center gap-1"><HiOutlineEye className="text-xs" />{localNote.views || 0}</span>
            <span className="flex items-center gap-1"><HiOutlineArrowDownCircle className="text-xs" />{localNote.downloads || 0}</span>
            <span className="flex items-center gap-1"><HiOutlineChatBubbleLeft className="text-xs" />{localNote.comments?.length || 0}</span>
          </div>
        </div>

        {/* Uploader + date */}
        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600">
          {localNote.uploadedBy && (
            <span>By <span className="text-slate-400 font-medium">{localNote.uploadedBy.name || localNote.uploadedBy.email}</span></span>
          )}
          {localNote.createdAt && (
            <span className="flex items-center gap-1">
              <HiOutlineCalendarDays className="text-xs" />
              {new Date(localNote.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <motion.button type="button" onClick={handleDownload} disabled={downloading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-white disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 4px 15px rgba(124,58,237,0.25)' }}>
            <HiOutlineArrowDownTray className="text-sm" />
            {downloading ? 'Downloading…' : 'Download +5XP'}
          </motion.button>
          {canDelete && (
            <button type="button" onClick={() => onDelete(note._id)}
              className="flex items-center justify-center rounded-xl px-3 py-2.5 text-xs font-semibold transition-all"
              style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', color: '#fca5a5' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}>
              <HiOutlineTrash className="text-sm" />
            </button>
          )}
        </div>

        {/* Message + Comments */}
        <div className="mt-3 space-y-2">
          <NoteMessage note={localNote} />
          <button onClick={() => setShowComments(!showComments)}
            className="text-xs font-medium flex items-center gap-1 text-slate-600 hover:text-[#a78bfa] transition-colors">
            <HiOutlineChatBubbleLeft className="text-sm" />
            {showComments ? 'Hide' : 'Show'} comments ({localNote.comments?.length || 0})
          </button>
        </div>

        {/* Comments section */}
        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3 space-y-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment... (+2 XP)"
                  className="flex-1 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none transition placeholder:text-slate-600"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(124,58,237,0.4)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.07)'} />
                <button type="submit" disabled={!newComment.trim()}
                  className="rounded-xl px-3 py-2 text-xs font-bold text-white disabled:opacity-40 transition-all"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}>
                  Post
                </button>
              </form>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {localNote.comments?.map((c) => (
                  <div key={c._id} className="rounded-xl p-3 flex items-start justify-between gap-2"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <p className="text-xs font-bold text-slate-300">{c.user?.name || 'Anonymous'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{c.text}</p>
                    </div>
                    {(user?._id === c.user?._id || user?.role === 'admin') && (
                      <button onClick={() => handleDeleteComment(c._id)} className="text-xs text-red-500 hover:text-red-400 flex-shrink-0">✕</button>
                    )}
                  </div>
                ))}
                {(!localNote.comments || localNote.comments.length === 0) && (
                  <p className="text-xs text-slate-600 text-center py-2">No comments yet 💬</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
