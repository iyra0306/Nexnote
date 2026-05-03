import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePaperAirplane } from 'react-icons/hi2';
import { useToast } from '../components/Toast';

export default function Contact() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      addToast('✉️ Message sent! +2 XP earned!', 'success');
      setName(''); setEmail(''); setSubject(''); setMessage('');
      setLoading(false);
    }, 1000);
  };

  const inputClass = "w-full rounded-xl border border-amber-500/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 placeholder:text-slate-600";

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-3xl">✉️</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-50">Contact Guild</h1>
            <p className="text-sm text-amber-600/70 font-semibold">Send a message, earn +2 XP</p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-amber-500/10 bg-[#0d0d20] p-6 sm:p-8">
          <h2 className="text-base font-black text-amber-400 mb-6">📨 Send a Message +2 XP</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: '👤 Your Name',  value: name,    onChange: setName,    type: 'text',  placeholder: 'Your name' },
              { label: '📧 Your Email', value: email,   onChange: setEmail,   type: 'email', placeholder: 'you@chitkara.edu.in' },
              { label: '📌 Subject',    value: subject, onChange: setSubject, type: 'text',  placeholder: 'How can we help?' },
            ].map(({ label, value, onChange, type, placeholder }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">{label}</label>
                <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
                  className={inputClass} placeholder={placeholder} required />
              </div>
            ))}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">💬 Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5}
                className={`${inputClass} resize-none`} placeholder="Tell us more..." required />
            </div>
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
              className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 py-4 text-sm font-black text-white shadow-[0_8px_30px_rgba(245,158,11,0.5)] disabled:opacity-60">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <HiOutlinePaperAirplane className="text-lg" />
                {loading ? '⏳ Sending...' : '✉️ Send Message +2 XP'}
              </span>
            </motion.button>
          </form>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="space-y-4">

          <div className="rounded-3xl border border-amber-500/10 bg-[#0d0d20] p-6 space-y-4">
            <h3 className="text-base font-black text-amber-400">🗺️ Guild HQ</h3>
            {[
              { icon: '📧', label: 'Email',    value: 'iyra0367.becse24@chitkara.edu.in', href: 'mailto:iyra0367.becse24@chitkara.edu.in', color: 'text-amber-300' },
              { icon: '🏛️', label: 'Location', value: 'Chitkara University, Punjab',       color: 'text-slate-300' },
              { icon: '⏰', label: 'Support',  value: 'Available 24/7 · Reply within 24h', color: 'text-slate-300' },
            ].map(({ icon, label, value, href, color }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{icon}</span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">{label}</p>
                  {href
                    ? <a href={href} className={`text-sm ${color} hover:underline`}>{value}</a>
                    : <p className={`text-sm ${color}`}>{value}</p>
                  }
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-amber-500/10 bg-[#0d0d20] p-6 space-y-3">
            <h3 className="text-base font-black text-amber-400">⚔️ Guild Info</h3>
            {[
              ['Developer', 'Iyra Gupta'],
              ['Project',   'NEXNOTE'],
              ['Version',   '2.0 (Gamified Edition)'],
              ['Status',    '🟢 Active Development'],
            ].map(([k, v]) => (
              <p key={k} className="text-sm text-slate-400">
                <span className="text-slate-300 font-bold">{k}:</span> {v}
              </p>
            ))}
          </div>

          <div className="rounded-3xl border border-amber-500/10 bg-[#0d0d20] p-6 space-y-3">
            <h3 className="text-base font-black text-amber-400">❓ FAQ</h3>
            {[
              ['How do I upload notes?',  'Login as teacher → Upload Quest page'],
              ['Can I download offline?', 'Yes! Click Download on any note card'],
              ['How to report a bug?',    'Use the form above or email directly'],
            ].map(([q, a]) => (
              <div key={q}>
                <p className="text-sm font-bold text-slate-300">{q}</p>
                <p className="text-xs text-slate-500 mt-0.5">{a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
