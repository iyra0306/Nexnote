import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineCloudArrowUp } from 'react-icons/hi2';
import { notesAPI } from '../api/api';
import { useToast } from '../components/Toast';

const departments   = ['CSE', 'ECE', 'Mechanical', 'Civil', 'IT', 'EEE', 'Chemical', 'Biotechnology', 'Other'];
const semesters     = [1, 2, 3, 4, 5, 6, 7, 8];
const examTagOptions = ['midterm', 'final', 'quick-revision', 'important'];

export default function UploadNotes() {
  const [title, setTitle]                       = useState('');
  const [subject, setSubject]                   = useState('');
  const [department, setDepartment]             = useState('');
  const [semester, setSemester]                 = useState('');
  const [isImportantForExam, setIsImportantForExam] = useState(false);
  const [examTags, setExamTags]                 = useState([]);
  const [syllabusUnit, setSyllabusUnit]         = useState('');
  const [file, setFile]                         = useState(null);
  const [loading, setLoading]                   = useState(false);
  const [dragActive, setDragActive]             = useState(false);
  const [xpEarned, setXpEarned]                 = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file)               { addToast('Please select a file (PDF, DOC, or DOCX)', 'error'); return; }
    if (!department || !semester) { addToast('Please select department and semester', 'error'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subject', subject);
      formData.append('department', department);
      formData.append('semester', semester);
      formData.append('isImportantForExam', isImportantForExam);
      if (examTags.length > 0) formData.append('examTags', JSON.stringify(examTags));
      if (syllabusUnit)        formData.append('syllabusUnit', syllabusUnit);
      formData.append('file', file);
      await notesAPI.upload(formData);
      addToast('⚔️ Scroll uploaded! +10 XP earned!', 'success');
      setXpEarned(true);
      setTimeout(() => setXpEarned(false), 3000);
      setTitle(''); setSubject(''); setDepartment(''); setSemester('');
      setIsImportantForExam(false); setExamTags([]); setSyllabusUnit(''); setFile(null);
      const input = document.getElementById('file-input');
      if (input) input.value = '';
    } catch (err) { addToast(err.response?.data?.message || 'Upload failed', 'error'); }
    finally { setLoading(false); setDragActive(false); }
  };

  const toggleExamTag = (tag) => setExamTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleFileSelect = (f) => { if (f) setFile(f); };
  const handleDrop       = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); handleFileSelect(e.dataTransfer.files?.[0]); };
  const handleDragOver   = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); };
  const handleDragLeave  = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); };

  const inputClass = "w-full rounded-xl border border-amber-500/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 placeholder:text-slate-600";

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚔️</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-50">Upload Quest</h1>
            <p className="text-sm text-amber-600/70 font-semibold">Share knowledge, earn +10 XP per scroll</p>
          </div>
        </div>
      </motion.div>

      {/* XP Earned Banner */}
      <AnimatePresence>
        {xpEarned && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-orange-500/10 p-4 flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="text-base font-black text-amber-300">+10 XP EARNED!</p>
              <p className="text-xs text-amber-600">Scroll uploaded successfully. Keep sharing knowledge!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">

        {/* Form */}
        <motion.form initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-amber-500/10 bg-[#0d0d20] p-6 sm:p-8">

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: '📌 Title',   value: title,   onChange: setTitle,   placeholder: 'e.g. Calculus Notes Ch.1' },
              { label: '📖 Subject', value: subject, onChange: setSubject, placeholder: 'e.g. Mathematics, Physics' },
            ].map(({ label, value, onChange, placeholder }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">{label}</label>
                <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
                  className={inputClass} placeholder={placeholder} required />
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">🏛️ Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className={inputClass} required>
                <option value="">Select</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">📅 Semester</label>
              <select value={semester} onChange={(e) => setSemester(e.target.value)} className={inputClass} required>
                <option value="">Select</option>
                {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">📚 Unit</label>
              <input type="number" min="1" max="10" value={syllabusUnit} onChange={(e) => setSyllabusUnit(e.target.value)}
                className={inputClass} placeholder="1-10" />
            </div>
          </div>

          {/* Exam Important */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 cursor-pointer"
              onClick={() => setIsImportantForExam(!isImportantForExam)}>
              <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${isImportantForExam ? 'border-amber-500 bg-amber-500' : 'border-slate-600'}`}>
                {isImportantForExam && <span className="text-white text-xs font-black">✓</span>}
              </div>
              <label className="text-sm font-bold text-amber-300 cursor-pointer">🎯 Mark as Exam Important (+bonus XP)</label>
            </div>

            <AnimatePresence>
              {isImportantForExam && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">🏷️ Exam Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {examTagOptions.map(tag => (
                      <button key={tag} type="button" onClick={() => toggleExamTag(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          examTags.includes(tag)
                            ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                            : 'bg-[#0f0f25] text-slate-500 border border-white/5 hover:border-amber-500/20 hover:text-slate-300'
                        }`}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* File Drop */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-amber-700">📎 File (PDF, DOC, DOCX)</label>
            <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('file-input')?.click()}
              className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition-all ${
                dragActive
                  ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_40px_rgba(245,158,11,0.3)]'
                  : 'border-amber-500/20 bg-slate-950/40 hover:border-amber-400/50 hover:bg-amber-500/5'
              }`}>
              <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.3)]">
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
                  <HiOutlineCloudArrowUp className="text-3xl" />
                </motion.div>
              </div>
              <p className="text-sm font-bold text-slate-200">
                {file
                  ? <span className="text-amber-300">📄 {file.name}</span>
                  : <><span className="text-slate-100">Drop your scroll here</span> <span className="text-slate-500">or click to browse</span></>
                }
              </p>
              <p className="mt-1 text-xs text-slate-500">PDF, DOC, DOCX (max 10MB)</p>
              <input id="file-input" type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} />
            </div>
          </div>

          <motion.button type="submit" disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
            className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 py-4 text-sm font-black text-white shadow-[0_8px_30px_rgba(245,158,11,0.5)] transition-all hover:shadow-[0_8px_40px_rgba(245,158,11,0.7)] disabled:opacity-60">
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? '⏳ Uploading scroll...' : <><span>⚔️</span> Upload Scroll +10 XP <span>→</span></>}
            </span>
            {!loading && (
              <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />
            )}
          </motion.button>
        </motion.form>

        {/* Illustration */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="space-y-4">
          <div className="rounded-3xl border border-amber-500/10 bg-[#0d0d20] p-6">
            <h3 className="text-base font-black text-amber-400 mb-2">⚔️ Upload Quest Rules</h3>
            <div className="space-y-3">
              {[
                { icon: '📕', text: 'PDF files supported' },
                { icon: '📘', text: 'DOC/DOCX files supported' },
                { icon: '📏', text: 'Max file size: 10MB' },
                { icon: '🎯', text: 'Mark exam notes for bonus XP' },
                { icon: '🏛️', text: 'Select correct department' },
                { icon: '⚡', text: 'Earn +10 XP per upload' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-slate-400">
                  <span className="text-lg">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-amber-500/10 bg-[#0d0d20] p-4">
            <img src="/upload illustration.png" alt="Upload" className="w-full h-auto object-contain rounded-2xl"
              onError={(e) => e.target.style.display='none'} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
