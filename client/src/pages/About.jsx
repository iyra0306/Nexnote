import { motion } from 'framer-motion';
import {
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineCloudArrowUp,
  HiOutlineSparkles,
  HiOutlineUser,
} from 'react-icons/hi2';

const featureCards = [
  {
    title: 'Secure Storage',
    icon: HiOutlineShieldCheck,
    description:
      'All notes are stored safely with robust backend validation and persistent storage in MongoDB.',
  },
  {
    title: 'Fast Access',
    icon: HiOutlineBolt,
    description:
      'Search and access notes instantly with an API-first architecture optimized for performance.',
  },
  {
    title: 'Easy Upload',
    icon: HiOutlineCloudArrowUp,
    description:
      'Upload PDF, DOC, and DOCX files in just a few clicks with drag-and-drop support.',
  },
  {
    title: 'Modern Design',
    icon: HiOutlineSparkles,
    description:
      'A clean, modern UI with dark theme, glassmorphism, and delightful micro-interactions.',
  },
];

export default function About() {
  return (
    <div className="space-y-10 text-slate-100">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center"
      >
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
            About NEXNOTE
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50">
            A modern notes workspace
            <span className="block bg-gradient-to-r from-cyan-400 to-sky-500 bg-clip-text text-transparent">
              built for teachers & students.
            </span>
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-slate-400">
            NEXNOTE is a modern notes management platform designed to help teachers upload,
            organize, and share notes effortlessly, while giving students fast and reliable access
            to high-quality study materials.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs sm:text-sm">
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-300 border border-cyan-500/40">
              Backend-first architecture
            </span>
            <span className="rounded-full bg-slate-900/40 px-3 py-1 text-slate-300 border border-white/5">
              Dark theme SaaS UI
            </span>
            <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-300 border border-sky-500/40">
              Smooth animations
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
              src="https://images.undraw.co/illustrations/note-taking-dark.svg"
              alt="Modern notes management illustration"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="space-y-4"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">Why NEXNOTE?</h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
          Built as a focused notes hub, NEXNOTE combines a production-ready backend with a premium
          frontend experience. It is designed to be reliable, easy to extend, and delightful to use.
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.05, translateY: -4 }}
                className="group rounded-2xl border border-white/10 bg-[#111827]/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl transition-colors hover:border-cyan-400/60 hover:bg-[#020617]/80"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300 shadow-[0_0_24px_rgba(56,189,248,0.35)] group-hover:bg-cyan-500/25">
                  <Icon className="text-xl" />
                </div>
                <h3 className="text-sm font-semibold text-slate-50">{feature.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Team section */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="space-y-5"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">Our Team</h2>
        
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Iyra - Backend Developer */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-950/90 to-slate-900/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 shadow-[0_0_40px_rgba(168,85,247,0.8)]">
                <div className="absolute inset-[2px] rounded-2xl bg-slate-950/80 backdrop-blur" />
                <div className="relative flex h-full w-full items-center justify-center">
                  <span className="text-xl font-bold text-transparent bg-gradient-to-br from-indigo-400 to-pink-400 bg-clip-text">I</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.25em] text-purple-400/80">
                  Backend Developer
                </p>
                <h3 className="text-lg font-bold text-slate-50">Iyra</h3>
                <p className="text-xs text-slate-400 mt-1">
                  APIs, Authentication & Deployment
                </p>
                <div className="mt-3 space-y-1 text-xs text-slate-300">
                  <p><span className="text-slate-500">Focus:</span> Express.js, MongoDB, JWT</p>
                  <p><span className="text-slate-500">Email:</span> iyra0367.becse24@chitkara.edu.in</p>
                </div>
              </div>
            </div>
          </div>

          {/* Neeti - Project Lead & Frontend */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-950/90 to-slate-900/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-500 shadow-[0_0_40px_rgba(56,189,248,0.8)]">
                <div className="absolute inset-[2px] rounded-2xl bg-slate-950/80 backdrop-blur" />
                <div className="relative flex h-full w-full items-center justify-center">
                  <span className="text-xl font-bold text-transparent bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text">N</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400/80">
                  Project Lead & Frontend
                </p>
                <h3 className="text-lg font-bold text-slate-50">Neeti</h3>
                <p className="text-xs text-slate-400 mt-1">
                  React, UI/UX Design & Team Coordination
                </p>
                <div className="mt-3 space-y-1 text-xs text-slate-300">
                  <p><span className="text-slate-500">Focus:</span> React, Design, Components</p>
                  <p><span className="text-slate-500">Role:</span> Leadership & Frontend Development</p>
                </div>
              </div>
            </div>
          </div>

          {/* Manleen - Database & Integration */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-950/90 to-slate-900/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 shadow-[0_0_40px_rgba(52,211,153,0.8)]">
                <div className="absolute inset-[2px] rounded-2xl bg-slate-950/80 backdrop-blur" />
                <div className="relative flex h-full w-full items-center justify-center">
                  <span className="text-xl font-bold text-transparent bg-gradient-to-br from-emerald-400 to-teal-400 bg-clip-text">M</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/80">
                  Database Administrator
                </p>
                <h3 className="text-lg font-bold text-slate-50">Manleen</h3>
                <p className="text-xs text-slate-400 mt-1">
                  MongoDB, API Integration & File Uploads
                </p>
                <div className="mt-3 space-y-1 text-xs text-slate-300">
                  <p><span className="text-slate-500">Focus:</span> Database, API Calls, Storage</p>
                  <p><span className="text-slate-500">Role:</span> Data Management & Integration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Eknoor - Testing & Documentation */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-950/90 to-slate-900/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-[0_0_40px_rgba(251,146,60,0.8)]">
                <div className="absolute inset-[2px] rounded-2xl bg-slate-950/80 backdrop-blur" />
                <div className="relative flex h-full w-full items-center justify-center">
                  <span className="text-xl font-bold text-transparent bg-gradient-to-br from-amber-400 to-red-400 bg-clip-text">E</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.25em] text-amber-400/80">
                  QA & Documentation
                </p>
                <h3 className="text-lg font-bold text-slate-50">Eknoor</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Testing, Quality Assurance & Documentation
                </p>
                <div className="mt-3 space-y-1 text-xs text-slate-300">
                  <p><span className="text-slate-500">Focus:</span> Testing, Guides, Bug Tracking</p>
                  <p><span className="text-slate-500">Role:</span> Quality & Documentation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

