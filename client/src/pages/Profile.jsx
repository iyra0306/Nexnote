import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePencil, HiOutlineKey, HiOutlineTrophy, HiOutlineFire, HiOutlineStar } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import AvatarBuilder, { AvatarDisplay } from '../components/AvatarBuilder';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const RANK_LEVELS = [
  { min: 0,   label: 'Novice',  icon: '🌱', color: 'text-slate-400',  next: 50  },
  { min: 50,  label: 'Scholar', icon: '📖', color: 'text-cyan-400',   next: 150 },
  { min: 150, label: 'Adept',   icon: '⚡', color: 'text-blue-400',   next: 300 },
  { min: 300, label: 'Expert',  icon: '🔮', color: 'text-purple-400', next: 500 },
  { min: 500, label: 'Master',  icon: '👑', color: 'text-amber-400',  next: 999 },
  { min: 999, label: 'Legend',  icon: '🌟', color: 'text-rose-400',   next: 9999 },
];

const BADGES_LIST = [
  { id: 'uploader',  icon: '⚔️', label: 'Note Warrior',  desc: 'Uploaded notes',       color: 'from-orange-500/20 to-red-500/20',   border: 'border-orange-500/30' },
  { id: 'scholar',   icon: '📚', label: 'Scholar',        desc: 'Accessed 10+ notes',   color: 'from-blue-500/20 to-cyan-500/20',    border: 'border-blue-500/30' },
  { id: 'collector', icon: '💎', label: 'Collector',      desc: 'Saved 5+ favorites',   color: 'from-purple-500/20 to-pink-500/20',  border: 'border-purple-500/30' },
  { id: 'streak',    icon: '🔥', label: 'On Fire',        desc: '3-day streak',         color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
  { id: 'commenter', icon: '💬', label: 'Commentator',    desc: 'Posted 5+ comments',   color: 'from-green-500/20 to-teal-500/20',   border: 'border-green-500/30' },
  { id: 'rater',     icon: '⭐', label: 'Critic',         desc: 'Rated 10+ notes',      color: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-500/30' },
];

function getRank(points = 0) {
  return [...RANK_LEVELS].reverse().find(r => points >= r.min) || RANK_LEVELS[0];
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { addToast }         = useToast();
  const [editing, setEditing]               = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [editingAvatar, setEditingAvatar]   = useState(false);
  const [formData, setFormData]             = useState({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' });
  const [passwordData, setPasswordData]     = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [localAvatar, setLocalAvatar]       = useState(() => localStorage.getItem('nexnote_avatar') || '');

  const points = user?.points || 0;
  const streak = user?.streak || 1;
  const rank   = getRank(points);
  const nextRank = RANK_LEVELS.find(r => r.min > points) || RANK_LEVELS[RANK_LEVELS.length - 1];
  const xpPct  = Math.min(100, Math.round((points / nextRank.min) * 100));

  useEffect(() => {
    if (user) setFormData({ name: user.name || '', bio: user.bio || '', avatar: user.avatar || '' });
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(`${API_URL}/users/profile`, formData, { headers: { Authorization: `Bearer ${token}` } });
      updateUser(data);
      addToast('✅ Character updated!', 'success');
      setEditing(false);
    } catch (err) { addToast(err.response?.data?.message || 'Update failed', 'error'); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) { addToast('Passwords do not match', 'error'); return; }
    if (passwordData.newPassword.length < 6) { addToast('Min 6 characters', 'error'); return; }
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/users/change-password`, { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }, { headers: { Authorization: `Bearer ${token}` } });
      addToast('🔐 Password changed!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setChangingPassword(false);
    } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  const inputClass = "w-full rounded-xl border border-amber-500/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 disabled:opacity-50 placeholder:text-slate-600";

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧙</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-50">My Character</h1>
            <p className="text-sm text-amber-600/70 font-semibold">Manage your hero profile</p>
          </div>
        </div>
      </motion.div>

      {/* Character Card */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#1a1200] via-[#0d0d20] to-[#0a0a1a] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="relative cursor-pointer" onClick={() => setEditingAvatar(!editingAvatar)}>
              <AvatarDisplay avatarStr={localAvatar} name={user?.name || 'U'} size="xl" />
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-amber-500 border-2 border-[#0a0a1a] flex items-center justify-center text-sm shadow-gold">
                ✏️
              </div>
            </div>
            <p className="text-[10px] text-amber-600 text-center mt-2 font-semibold">Click to edit</p>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <h2 className="text-2xl font-black text-slate-50">{user?.name || 'Hero'}</h2>
              <p className="text-sm text-slate-400">{user?.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <span className={`rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-black ${rank.color}`}>
                  {rank.icon} {rank.label}
                </span>
                <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300 capitalize">
                  🎭 {user?.role}
                </span>
                {user?.department && (
                  <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                    🏛️ {user.department}
                  </span>
                )}
                {user?.semester && (
                  <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-300">
                    📅 Sem {user.semester}
                  </span>
                )}
              </div>
            </div>

            {/* XP Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-amber-400">⚡ {points} XP</span>
                <span className="text-slate-500">Next: {nextRank.label} ({nextRank.min} XP)</span>
              </div>
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              </div>
              <p className="text-xs text-slate-500">{xpPct}% to {nextRank.label}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex sm:flex-col gap-4 sm:gap-3">
            <div className="text-center rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
              <HiOutlineTrophy className="text-amber-400 text-xl mx-auto mb-1" />
              <p className="text-lg font-black text-amber-400">{points}</p>
              <p className="text-[10px] text-amber-600 font-semibold">XP</p>
            </div>
            <div className="text-center rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-3">
              <HiOutlineFire className="text-orange-400 text-xl mx-auto mb-1" />
              <p className="text-lg font-black text-orange-400">{streak}</p>
              <p className="text-[10px] text-orange-600 font-semibold">Streak</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Avatar Builder Panel */}
      {editingAvatar && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-amber-500/20 bg-[#0d0d20] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-amber-400">🎨 Customize Avatar</h2>
            <button onClick={() => setEditingAvatar(false)}
              className="text-xs font-black text-slate-500 hover:text-slate-300 border border-white/10 bg-white/5 px-3 py-1.5 rounded-xl">
              ✕ Close
            </button>
          </div>
          <AvatarBuilder value={localAvatar} onChange={(val) => {
            setLocalAvatar(val);
            localStorage.setItem('nexnote_avatar', val);
          }} />
          <motion.button onClick={() => setEditingAvatar(false)}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-black text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)]">
            ✅ Save Avatar
          </motion.button>
        </motion.div>
      )}

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="space-y-3">
        <h2 className="text-base font-black text-slate-200 flex items-center gap-2">
          <HiOutlineStar className="text-amber-400" /> Achievement Badges
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BADGES_LIST.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }} whileHover={{ scale: 1.08, translateY: -4 }}
              className={`rounded-2xl border ${b.border} bg-gradient-to-br ${b.color} p-4 text-center cursor-default`}>
              <span className="text-3xl block mb-2">{b.icon}</span>
              <p className="text-xs font-black text-slate-200">{b.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Edit Profile + Change Password */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Edit Profile */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-3xl border border-amber-500/10 bg-[#0d0d20] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-200 flex items-center gap-2">
              <HiOutlinePencil className="text-amber-400" /> Edit Character
            </h2>
            <button onClick={() => setEditing(!editing)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                editing ? 'border border-red-500/30 bg-red-500/10 text-red-400' : 'border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
              }`}>
              {editing ? '✕ Cancel' : '✏️ Edit'}
            </button>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {[
              { label: '👤 Name',  value: formData.name,   key: 'name',   type: 'text',  placeholder: 'Your name' },
              { label: '🖼️ Avatar URL', value: formData.avatar, key: 'avatar', type: 'text', placeholder: 'https://...' },
            ].map(({ label, value, key, type, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">{label}</label>
                <input type={type} value={value} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  disabled={!editing} className={inputClass} placeholder={placeholder} />
              </div>
            ))}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">📖 Bio</label>
              <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!editing} rows={3} maxLength={500}
                className={`${inputClass} resize-none`} placeholder="Tell your story..." />
              <p className="text-[10px] text-slate-600 text-right">{formData.bio.length}/500</p>
            </div>

            {editing && (
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-black text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)]">
                ✅ Save Character
              </motion.button>
            )}
          </form>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-3xl border border-amber-500/10 bg-[#0d0d20] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-200 flex items-center gap-2">
              <HiOutlineKey className="text-amber-400" /> Change Password
            </h2>
          </div>

          {!changingPassword ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4 text-center">
                <span className="text-3xl block mb-2">🔐</span>
                <p className="text-sm text-slate-400">Keep your account secure with a strong password</p>
              </div>
              <motion.button onClick={() => setChangingPassword(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-black text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)]">
                🔐 Change Password
              </motion.button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              {[
                { label: '🔑 Current Password', key: 'currentPassword' },
                { label: '🆕 New Password',     key: 'newPassword' },
                { label: '✅ Confirm Password', key: 'confirmPassword' },
              ].map(({ label, key }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">{label}</label>
                  <input type="password" value={passwordData[key]}
                    onChange={(e) => setPasswordData({ ...passwordData, [key]: e.target.value })}
                    required minLength={6} className={inputClass} placeholder="••••••••" />
                </div>
              ))}
              <div className="flex gap-3">
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-black text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)]">
                  🔐 Update
                </motion.button>
                <button type="button" onClick={() => { setChangingPassword(false); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
