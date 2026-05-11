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

const FILE_CONFIG = {
  pdf:  { emoji: '📕', color: '#ff4757', label: 'PDF',  rarity: 'COMMON' },
  doc:  { emoji: '📘', color: '#2979ff', label: 'DOC',  rarity: 'UNCOMMON' },
  docx: { emoji: '📗', color: '#00e676', label: 'DOCX', rarity: 'RARE' },
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
      addToast('⚡ DOWNLOAD COMPLETE — +5 XP', 'success');
      showXP('+5 XP');
      const stored = JSON.parse(localStorage.getItem('nexnote_user') || '{}');
      if (stored.points !== undefined) syncPoints((stored.points || 0) + 5);
    } catch { addToast('DOWNLOAD FAILED', 'error'); }
    finally { setDownloading(false); }
  };

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/users/favorites/${note._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setIsFavorite(data.isFavorite);
      addToast(data.isFavorite ? '💎 SAVED TO ARSENAL +2 XP' : 'REMOVED FROM ARSENAL', 'success');
      if (data.isFavorite) showXP('+2 XP');
    } catch { addToast('FAILED', 'error'); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/notes/${note._id}/comments`, { text: newComment }, { headers: { Authorization: `Bearer ${token}` } });
      setLocalNote(data); setNewComment('');
      addToast('COMMENT POSTED +2 XP', 'success');
      showXP('+2 XP');
      if (data._userPoints !== undefined) syncPoints(data._userPoints);
      if (onUpdate) onUpdate(data);
    } catch (err) { addToast(err.response?.data?.message || 'FAILED', 'error'); }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/notes/${note._id}/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });
      setLocalNote({ ...localNote, comments: localNote.comments.filter(c => c._id !== commentId) });
      addToast('DELETED', 'success');
    } catch { addToast('FAILED', 'error'); }
  };

  const handleRate = async (rating) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/notes/${note._id}/ratings`, { rating }, { headers: { Authorization: `Bearer ${token}` } });
      setLocalNote({ ...localNote, averageRating: data.averageRating });
      addToast('RATED +3 XP', 'success');
      showXP('+3 XP');
      if (data._userPoints !== undefined) syncPoints(data._userPoints);
    } catch { addToast('FAILED', 'error'); }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-xl overflow-hidden transition-all duration-300 rpg-card bracket-tl bracket-br"
      style={{ background: 'linear-gradient(135deg, rgba(13,30,46,0.98), rgba(6,13,20,0.99))' }}>

      {/* Rarity top bar */}
      <div className="h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }} />

      {/* XP Pop */}
      <AnimatePresence>
        {xpPop && (
          <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -40 }}
            exit={{ opacity: 0 }} transition={{ duration: 1 }}
            className="absolute top-3 right-3 z-20 rounded-lg px-3 py-1 text-xs font-black text-black pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #00d4aa, #f0b429)', boxShadow: '0 4px 15px rgba(0,212,170,0.4)' }}>
            {xpPop}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* File icon with rarity glow */}
          <div className="relative flex-shrink-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl text-3xl"
              style={{ background: `${cfg.color}10`, border: `1px solid ${cfg.color}30`, boxShadow: `0 0 15px ${cfg.color}15` }}>
              {cfg.emoji}
            </div>
            {/* Rarity label */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded px-1.5 py-0.5 text-[7px] font-black tracking-widest whitespace-nowrap"
              style={{ background: `${cfg.color}20`, border: `1px solid ${cfg.color}40`, color: cfg.color }}>
              {cfg.rarity}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-black text-white truncate leading-tight">{localNote.title}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(0,212,170,0.6)' }}>{localNote.subject}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {localNote.isImportantForExam && (
                  <span className="rounded-lg px-2 py-0.5 text-[9px] font-black tracking-widest uppercase text-black"
                    style={{ background: 'linear-gradient(135deg, #f0b429, #ff8c00)' }}>
                    🎯 EXAM
                  </span>
                )}
                <button onClick={handleToggleFavorite} className="p-1.5 rounded-lg transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {isFavorite
                    ? <HiHeart className="text-base" style={{ color: '#ff4757', filter: 'drop-shadow(0 0 6px #ff4757)' }} />
                    : <HiOutlineHeart className="text-base text-slate-600 hover:text-[#ff4757] transition-colors" />}
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {localNote.department && (
                <span className="rounded-md px-2 py-0.5 text-[9px] font-black tracking-widest uppercase"
                  style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', color: '#00d4aa' }}>
                  {localNote.department}
                </span>
              )}
              {localNote.semester && (
                <span className="rounded-md px-2 py-0.5 text-[9px] font-black tracking-widest uppercase"
                  style={{ background: 'rgba(41,121,255,0.08)', border: '1px solid rgba(41,121,255,0.2)', color: '#2979ff' }}>
                  SEM {localNote.semester}
                </span>
              )}
              {localNote.examTags?.map(t => (
                <span key={t} className="rounded-md px-2 py-0.5 text-[9px] font-black tracking-widest uppercase"
                  style={{ background: 'rgba(240,180,41,0.08)', border: '1px solid rgba(240,180,41,0.2)', color: '#f0b429' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-4" style={{ background: 'rgba(0,212,170,0.06)' }} />

        {/* Rating + stats */}
        <div className="flex items-center justify-between mb-3">
          <StarRating rating={localNote.averageRating || 0} onRate={handleRate} size="sm" />
          <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest" style={{ color: 'rgba(0,212,170,0.4)' }}>
            <span className="flex items-center gap-1"><HiOutlineEye className="text-xs" />{localNote.views || 0}</span>
            <span className="flex items-center gap-1"><HiOutlineArrowDownCircle className="text-xs" />{localNote.downloads || 0}</span>
            <span className="flex items-center gap-1"><HiOutlineChatBubbleLeft className="text-xs" />{localNote.comments?.length || 0}</span>
          </div>
        </div>

        {/* Uploader */}
        <div className="flex items-center gap-3 mb-4 text-[10px] font-bold tracking-widest" style={{ color: 'rgba(148,163,184,0.5)' }}>
          {localNote.uploadedBy && (
            <span>BY <span style={{ color: 'rgba(0,212,170,0.6)' }}>{localNote.uploadedBy.name || localNote.uploadedBy.email}</span></span>
          )}
          {localNote.createdAt && (
            <span className="flex items-center gap-1">
              <HiOutlineCalendarDays className="text-xs" />
              {new Date(localNote.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-3">
          <motion.button type="button" onClick={handleDownload} disabled={downloading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black tracking-widest uppercase text-black disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #00d4aa, #00a882)', boxShadow: '0 4px 15px rgba(0,212,170,0.25)' }}>
            <HiOutlineArrowDownTray className="text-sm" />
            {downloading ? 'LOADING...' : 'ACQUIRE +5XP'}
          </motion.button>
          {canDelete && (
            <button type="button" onClick={() => onDelete(note._id)}
              className="flex items-center justify-center rounded-xl px-3 py-2.5 text-xs font-black tracking-widest uppercase transition-all"
              style={{ border: '1px solid rgba(255,71,87,0.25)', background: 'rgba(255,71,87,0.06)', color: '#ff4757' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,71,87,0.12)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,71,87,0.06)'}>
              <HiOutlineTrash className="text-sm" />
            </button>
          )}
        </div>

        {/* Message + Comments */}
        <div className="space-y-2">
          <NoteMessage note={localNote} />
          <button onClick={() => setShowComments(!showComments)}
            className="text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 transition-colors"
            style={{ color: 'rgba(0,212,170,0.4)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#00d4aa'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,212,170,0.4)'}>
            <HiOutlineChatBubbleLeft className="text-sm" />
            {showComments ? 'HIDE' : 'SHOW'} COMMS ({localNote.comments?.length || 0})
          </button>
        </div>

        {/* Comments */}
        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3 space-y-3"
              style={{ borderTop: '1px solid rgba(0,212,170,0.06)', paddingTop: '0.75rem' }}>
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
                  placeholder="TRANSMIT MESSAGE... (+2 XP)"
                  className="flex-1 rounded-xl px-3 py-2 text-xs text-white outline-none transition font-mono placeholder:text-slate-700"
                  style={{ background: 'rgba(0,212,170,0.04)', border: '1px solid rgba(0,212,170,0.1)' }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(0,212,170,0.3)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0,212,170,0.1)'} />
                <button type="submit" disabled={!newComment.trim()}
                  className="rounded-xl px-3 py-2 text-xs font-black tracking-widest uppercase text-black disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #00d4aa, #00a882)' }}>
                  SEND
                </button>
              </form>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {localNote.comments?.map((c) => (
                  <div key={c._id} className="rounded-xl p-3 flex items-start justify-between gap-2"
                    style={{ background: 'rgba(0,212,170,0.03)', border: '1px solid rgba(0,212,170,0.08)' }}>
                    <div>
                      <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: '#00d4aa' }}>{c.user?.name || 'ANONYMOUS'}</p>
                      <p className="text-xs text-slate-500 mt-1">{c.text}</p>
                    </div>
                    {(user?._id === c.user?._id || user?.role === 'admin') && (
                      <button onClick={() => handleDeleteComment(c._id)} className="text-xs text-[#ff4757] hover:text-red-400 flex-shrink-0">✕</button>
                    )}
                  </div>
                ))}
                {(!localNote.comments || localNote.comments.length === 0) && (
                  <p className="text-[10px] font-bold tracking-widest uppercase text-center py-2" style={{ color: 'rgba(0,212,170,0.3)' }}>
                    NO TRANSMISSIONS YET
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom rarity bar */}
      <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
        style={{ background: `linear-gradient(90deg, ${cfg.color}, transparent)` }} />
    </motion.article>
  );
}
