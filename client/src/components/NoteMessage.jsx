import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineChatBubbleLeftRight, HiXMark, HiPaperAirplane, HiOutlineCheckCircle } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const MESSAGE_TYPES = [
  { id: 'suggestion',   label: '💡 Suggestion',   desc: 'Suggest improvements' },
  { id: 'correction',   label: '✏️ Correction',   desc: 'Point out an error' },
  { id: 'question',     label: '❓ Question',      desc: 'Ask the uploader' },
  { id: 'appreciation', label: '🙏 Thanks',        desc: 'Thank the uploader' },
];

export default function NoteMessage({ note }) {
  const [open, setOpen]       = useState(false);
  const [type, setType]       = useState('suggestion');
  const [message, setMessage] = useState('');
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const { user }     = useAuth();
  const { addToast } = useToast();

  // Check if current user is the uploader - convert both to string for safe comparison
  const uploaderId    = note?.uploadedBy?._id?.toString() || note?.uploadedBy?.toString() || '';
  const currentUserId = user?._id?.toString() || '';
  const isUploader    = uploaderId && currentUserId && uploaderId === currentUserId;

  // Don't show button if user IS the uploader or if no uploader info
  if (!note?.uploadedBy || isUploader) return null;

  const uploaderName = note.uploadedBy?.name || note.uploadedBy?.email || 'the uploader';

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      const token   = localStorage.getItem('token');
      const msgText = `[${type.toUpperCase()}] ${message.trim()}`;
      await axios.post(
        `${API_URL}/notes/${note._id}/comments`,
        { text: msgText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSent(true);
      addToast('✉️ Message sent! +2 XP', 'success');
      setTimeout(() => {
        setSent(false);
        setOpen(false);
        setMessage('');
        setType('suggestion');
      }, 2000);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send message', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-bold text-indigo-400 hover:bg-indigo-500/20 transition-colors">
        <HiOutlineChatBubbleLeftRight className="text-sm" />
        Message Uploader
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !loading && setOpen(false)}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm" />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 z-[70] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-amber-500/20 bg-[#0d0d20] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.9)]">

              {/* Success State */}
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-6 text-center">
                  <span className="text-6xl">✉️</span>
                  <HiOutlineCheckCircle className="text-5xl text-green-400" />
                  <div>
                    <p className="text-lg font-black text-slate-50">Message Sent!</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {uploaderName} will see your feedback in the comments
                    </p>
                    <p className="text-xs text-amber-400 font-bold mt-2">+2 XP Earned! 🏆</p>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="text-base font-black text-slate-50 flex items-center gap-2">
                        <HiOutlineChatBubbleLeftRight className="text-amber-400" />
                        Message Uploader
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        To: <span className="text-amber-400 font-bold">{uploaderName}</span>
                        {' '}• <span className="text-slate-500">"{note.title}"</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors">
                      <HiXMark className="text-xl" />
                    </button>
                  </div>

                  <form onSubmit={handleSend} className="space-y-4">
                    {/* Type selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                        📌 Message Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {MESSAGE_TYPES.map(t => (
                          <button
                            key={t.id} type="button" onClick={() => setType(t.id)}
                            className={`rounded-xl p-3 text-left transition-all border ${
                              type === t.id
                                ? 'border-amber-500/40 bg-amber-500/15'
                                : 'border-white/5 bg-slate-950/40 hover:border-amber-500/20'
                            }`}>
                            <p className="text-xs font-black text-slate-200">{t.label}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{t.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message textarea */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                        💬 Your Message
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                        rows={4}
                        placeholder={
                          type === 'suggestion'   ? 'e.g. You could add more examples for topic X...' :
                          type === 'correction'   ? 'e.g. On page 3, the formula should be...' :
                          type === 'question'     ? 'e.g. Can you explain the concept of...' :
                                                    'e.g. Great notes! Really helped me understand...'
                        }
                        className="w-full rounded-xl border border-amber-500/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 resize-none placeholder:text-slate-600"
                        required
                      />
                      <p className="text-[10px] text-slate-600 text-right">{message.length}/500</p>
                    </div>

                    {/* Info box */}
                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 text-xs text-indigo-300">
                      💡 Appears as a comment on the note. Uploader will see it.
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button
                        type="button" onClick={() => setOpen(false)}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 transition-all">
                        Cancel
                      </button>
                      <motion.button
                        type="submit"
                        disabled={!message.trim() || loading}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-black text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
                        <HiPaperAirplane className="text-sm" />
                        {loading ? 'Sending...' : 'Send +2 XP'}
                      </motion.button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
