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
const FILE_COLORS = { pdf: '#ff0080', doc: '#00f5ff', docx: '#00ff88' };
const FILE_EMOJI  = { pdf: '📕', doc: '📘', docx: '📗' };

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
  const fileColor = FILE_COLORS[ext] || '#00f5ff';
  const fileEmoji = FILE_EMOJI[ext] || '📄';

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
    } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
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
    <motion.article
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
      style={{ background: 'rgba(10,10,24,0.9)', border: `1px solid ${fileColor}18`, boxShadow: `0 4px 30px rgba(0,0,0,0.5)` }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 20px 60px ${fileColor}15, 0 4px 30px rgba(0,0,0,0.5)`}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)'}>

      {/* Top color bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${fileColor}, transparent)` }} />

      {/* XP Pop */}
      <AnimatePresence>
        {xpPop && (
          <motion.div initial={{ opacity: 1, y: 0, scale: 1 }} animate={{ opacity: 0, y: -50, scale: 1.2 }}
            exit={{ opacity: 0 }} transition={{ duration: 1 }}
            className="absolute top-3 right-3 z-20 rounded-full px-3 py-1 text-xs font-black text-white pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #00f5ff, #bf00ff)', boxShadow: '0 0 20px rgba(0,245,255,0.5)' }}>
            {xpPop}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exam badge */}
      {localNote.isImportantForExam && (
        <div className="absolute -top-0 right-4 z-10 rounded-b-xl px-3 py-1 text-[10px] font-black text-white"
          style={{ background: 'linear-gradient(135deg, #ff0080, #bf00ff)', boxShadow: '0 4px 15px rgba(255,0,128,0.4)' }}>
          🎯 EXAM
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl flex-shrink-0"
            style={{ background: `${fileColor}12`, border: `1px solid ${fileColor}30` }}>
            {fileEmoji}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-black text-white">{localNote.title}</h3>
            <p className="mt-0.5 text-xs text-slate-500">{localNote.subject}</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {localNote.department && (
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)', color: '#00f5ff' }}>
                  {localNote.department}
                </span>
              )}
              {localNote.semester && (
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: 'rgba(191,0,255,0.08)', border: '1px solid rgba(191,0,255,0.2)', color: '#bf00ff' }}>
                  Sem {localNote.semester}
                </span>
              )}
              {localNote.examTags?.map(tag => (
                <span key={tag} className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: 'rgba(255,0,128,0.08)', border: '1px solid rgba(255,0,128,0.2)', color: '#ff0080' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button onClick={handleToggleFavorite} className="p-1.5 rounded-lg transition-all flex-shrink-0 hover:scale-110">
            {isFavorite
              ? <HiHeart className="text-lg" style={{ color: '#ff0080', filter: 'drop-shadow(0 0 6px #ff0080)' }} />
              : <HiOutlineHeart className="text-lg text-slate-600 hover:text-[#ff0080] transition-colors" />}
          </button>
        </div>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={localNote.averageRating || 0} onRate={handleRate} size="sm" />
        </div>

        {/* Meta */}
        <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
          {localNote.uploadedBy && (
            <span>By <span className="text-slate-400 font-medium">{localNote.uploadedBy.name || localNote.uploadedBy.email}</span></span>
          )}
          {localNote.createdAt && (
            <span className="inline-flex items-center gap-1">
              <HiOutlineCalendarDays className="text-xs" />
              {new Date(localNote.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="mb-4 flex gap-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1"><HiOutlineEye className="text-sm" />{localNote.views || 0}</span>
          <span className="inline-flex items-center gap-1"><HiOutlineArrowDownCircle className="text-sm" />{localNote.downloads || 0}</span>
          <span className="inline-flex items-center gap-1"><HiOutlineChatBubbleLeft className="text-sm" />{localNote.comments?.length || 0}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-3">
          <motion.button type="button" onClick={handleDownload} disabled={downloading}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-black text-white disabled:opacity-60 transition-all"
            style={{ background: 'linear-gradient(135deg, #00f5ff, #00ff88)', boxShadow: '0 4px 20px rgba(0,245,255,0.3)' }}>
            <HiOutlineArrowDownTray className="text-sm" />
            {downloading ? 'Downloading…' : 'Download +5XP'}
          </motion.button>
          {canDelete && (
            <button type="button" onClick={() => onDelete(note._id)}
              className="inline-flex items-center justify-center rounded-xl px-3 py-2.5 text-xs font-bold transition-all"
              style={{ border: '1px solid rgba(255,0,80,0.3)', background: 'rgba(255,0,80,0.08)', color: '#ff6464' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,0,80,0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,0,80,0.08)'}>
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
          className="text-xs font-bold flex items-center gap-1 transition-colors"
          style={{ color: 'rgba(0,245,255,0.6)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#00f5ff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,245,255,0.6)'}>
          <HiOutlineChatBubbleLeft className="text-sm" />
          {showComments ? 'Hide' : 'Show'} comments ({localNote.comments?.length || 0})
        </button>

        {/* Comments */}
        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} className="mt-4 space-y-3 overflow-hidden"
              style={{ borderTop: '1px solid rgba(0,245,255,0.08)', paddingTop: '1rem' }}>
              <form onSubmit={handleAddComment} className="space-y-2">
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment... (+2 XP)" rows={2}
                  className="w-full rounded-xl px-3 py-2 text-xs text-slate-100 outline-none transition resize-none placeholder:text-slate-600"
                  style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.12)' }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(0,245,255,0.4)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0,245,255,0.12)'} />
                <button type="submit" disabled={!newComment.trim()}
                  className="w-full rounded-xl px-3 py-1.5 text-xs font-black transition-all disabled:opacity-40"
                  style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)', color: '#00f5ff' }}>
                  Post Comment +2 XP
                </button>
              </form>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {localNote.comments?.map((c) => (
                  <div key={c._id} className="rounded-xl p-3"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs font-black text-slate-300">{c.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-slate-500 mt-1">{c.text}</p>
                      </div>
                      {(user?._id === c.user?._id || user?.role === 'admin') && (
                        <button onClick={() => handleDeleteComment(c._id)} className="text-xs text-red-500 hover:text-red-400">✕</button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-700 mt-1">{new Date(c.createdAt).toLocaleString()}</p>
                  </div>
                ))}
                {(!localNote.comments || localNote.comments.length === 0) && (
                  <p className="text-xs text-slate-600 text-center py-3">No comments yet. Be the first! 💬</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom accent */}
      <div className="h-0.5 w-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${fileColor}, transparent)` }} />
    </motion.article>
  );
}
