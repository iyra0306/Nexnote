import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiOutlineDocumentText, HiOutlineCloudArrowUp, HiOutlineSparkles, HiArrowRight } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { notesAPI } from '../api/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [totalNotes, setTotalNotes] = useState(0);
  const [recentNotes, setRecentNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await notesAPI.getAll();
        setTotalNotes(data?.length || 0);
        setRecentNotes(data?.slice(0, 5) || []);
      } catch {
        // fail silently; keep default
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero section */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center"
      >
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 shadow-[0_0_24px_rgba(56,189,248,0.45)]">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
            Live workspace
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-500 to-cyan-300 bg-clip-text text-transparent">
                NEXNOTE
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl">
              Your smart notes management system. Upload, organize, and share notes seamlessly with
              a premium, dark-themed dashboard experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
            <span className="rounded-full bg-slate-900/60 px-3 py-1 text-slate-300 border border-white/5">
              Welcome, {user?.name || user?.email?.split('@')[0] || 'Teacher'}
            </span>
            <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-cyan-300 border border-cyan-500/40">
              Total notes: {totalNotes}
            </span>
            <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-300 border border-sky-500/40">
              Backend powered by Express & MongoDB
            </span>
          </div>
        </div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
        >
          <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-cyan-500/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 shadow-[0_24px_80px_rgba(15,23,42,0.9)]">
            <img
              src="studying illustration.png.png"
              alt="Studying illustration"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Stats cards */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <StatCard
          icon={HiOutlineDocumentText}
          title="Total Notes"
          value={totalNotes}
          description="All notes stored securely and available to students anytime."
          accent="from-cyan-400 to-sky-500"
          onClick={() => navigate('/notes')}
        />
        <StatCard
          icon={HiOutlineCloudArrowUp}
          title="Upload Notes"
          value="Upload"
          description="Quickly upload new PDFs, DOC, and DOCX files for your classes."
          accent="from-sky-400 to-indigo-500"
          onClick={() => navigate('/upload')}
        />
        <StatCard
          icon={HiOutlineSparkles}
          title="Quick Access"
          value="Instant"
          description="Navigate to upload and notes pages with a single click."
          accent="from-fuchsia-400 to-cyan-400"
        />
      </motion.section>

      {/* Recent activity */}
      {recentNotes.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-50">Recent Notes</h2>
            <button
              onClick={() => navigate('/notes')}
              className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
            >
              View all
              <HiArrowRight className="text-sm" />
            </button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#111827]/80 overflow-hidden shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            <div className="divide-y divide-white/5">
              {recentNotes.map((note, i) => (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => navigate('/notes')}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                    <HiOutlineDocumentText className="text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-100 truncate">{note.title}</p>
                    <p className="text-xs text-slate-400">{note.subject}</p>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, title, value, description, accent, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, translateY: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl cursor-pointer"
    >
      <div
        className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${accent} blur-3xl`}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300 shadow-[0_0_24px_rgba(56,189,248,0.35)] group-hover:bg-cyan-500/25">
            <Icon className="text-xl" />
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {title}
          </p>
          <p className="text-xs text-slate-400 max-w-xs">{description}</p>
        </div>
        <p className="text-2xl font-semibold text-slate-50">{value}</p>
      </div>
      {onClick && (
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <HiArrowRight className="text-cyan-300 text-lg" />
        </div>
      )}
    </motion.div>
  );
}
