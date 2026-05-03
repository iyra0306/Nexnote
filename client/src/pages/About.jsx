import { motion } from 'framer-motion';
import { HiOutlineShieldCheck, HiOutlineBolt, HiOutlineCloudArrowUp, HiOutlineSparkles } from 'react-icons/hi2';

const featureCards = [
  { title: '🛡️ Secure Storage', icon: HiOutlineShieldCheck, description: 'All scrolls stored safely with robust backend validation and persistent MongoDB storage.' },
  { title: '⚡ Fast Access',    icon: HiOutlineBolt,         description: 'Search and access notes instantly with an API-first architecture optimized for performance.' },
  { title: '⚔️ Easy Upload',   icon: HiOutlineCloudArrowUp, description: 'Upload PDF, DOC, and DOCX files in just a few clicks with drag-and-drop support.' },
  { title: '🎮 Gamified UI',   icon: HiOutlineSparkles,     description: 'Earn XP, unlock badges, climb ranks — studying has never been this engaging!' },
];

const TEAM = [
  { name: 'Iyra',    role: 'Backend Developer',       desc: 'APIs, Authentication & Deployment',       focus: 'Express.js, MongoDB, JWT',     email: 'iyra0367.becse24@chitkara.edu.in', gradFrom: '#6366f1', gradTo: '#ec4899', glow: 'rgba(168,85,247,0.6)',  badge: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  { name: 'Neeti',   role: 'Project Lead & Frontend', desc: 'React, UI/UX Design & Team Coordination', focus: 'React, Design, Components',    email: '',                                 gradFrom: '#06b6d4', gradTo: '#3b82f6', glow: 'rgba(56,189,248,0.6)',  badge: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
  { name: 'Manleen', role: 'Database Administrator',  desc: 'MongoDB, API Integration & File Uploads', focus: 'Database, API Calls, Storage', email: '',                                 gradFrom: '#10b981', gradTo: '#14b8a6', glow: 'rgba(52,211,153,0.6)',  badge: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { name: 'Eknoor',  role: 'QA & Documentation',      desc: 'Testing, Quality Assurance & Docs',       focus: 'Testing, Guides, Bug Tracking',email: '',                                 gradFrom: '#f59e0b', gradTo: '#ef4444', glow: 'rgba(251,146,60,0.6)',  badge: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
];

export default function About() {
  return (
    <div className="space-y-10 text-slate-100">

      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#1a1200] via-[#0d0d20] to-[#0a0a1a] p-8 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs text-amber-300 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            🏛️ Chitkara University
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-50">
            About <span className="gradient-text-gold">NEXNOTE</span> ⚔️
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-slate-400">
            NEXNOTE is a gamified college notes management platform. Earn XP for uploading, downloading, and rating notes. Climb the rank ladder from Novice to Legend while mastering your subjects!
          </p>
          <div className="flex flex-wrap gap-2">
            {['🎮 Gamified Learning', '⚡ XP System', '🏆 Rank Ladder', '📚 MERN Stack', '🛡️ Secure'].map(t => (
              <span key={t} className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-300 font-semibold">{t}</span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="space-y-4">
        <h2 className="text-xl font-black text-slate-50 flex items-center gap-2">⚡ Why NEXNOTE?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }} whileHover={{ scale: 1.05, translateY: -4 }}
                className="rounded-2xl border border-amber-500/10 bg-[#0d0d20] p-5 hover:border-amber-500/30 transition-all">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                  <Icon className="text-xl" />
                </div>
                <h3 className="text-sm font-black text-slate-50">{f.title}</h3>
                <p className="mt-2 text-xs text-slate-400">{f.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Team */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="space-y-5">
        <h2 className="text-xl font-black text-slate-50 flex items-center gap-2">🧙 The Guild</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {TEAM.map((m, i) => (
            <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }} whileHover={{ scale: 1.02 }}
              className="rounded-2xl border border-amber-500/10 bg-[#0d0d20] p-5 hover:border-amber-500/20 transition-all">
              <div className="flex items-start gap-4">
                <div className="relative h-14 w-14 rounded-2xl flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${m.gradFrom}, ${m.gradTo})`, boxShadow: `0 0 30px ${m.glow}` }}>
                  <div className="absolute inset-[2px] rounded-xl bg-slate-950/80" />
                  <div className="relative flex h-full w-full items-center justify-center">
                    <span className="text-xl font-black text-white">{m.name[0]}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black text-slate-50">{m.name}</h3>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${m.badge}`}>{m.role}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                  <p className="text-xs text-slate-500 mt-1"><span className="text-slate-400">Focus:</span> {m.focus}</p>
                  {m.email && <p className="text-xs text-amber-500 mt-1">{m.email}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
