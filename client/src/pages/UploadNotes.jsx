import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCloudArrowUp } from 'react-icons/hi2';
import { notesAPI } from '../api/api';
import { useToast } from '../components/Toast';

export default function UploadNotes() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [isImportantForExam, setIsImportantForExam] = useState(false);
  const [examTags, setExamTags] = useState([]);
  const [syllabusUnit, setSyllabusUnit] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { addToast } = useToast();

  const departments = ['CSE', 'ECE', 'Mechanical', 'Civil', 'IT', 'EEE', 'Chemical', 'Biotechnology', 'Other'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const examTagOptions = ['midterm', 'final', 'quick-revision', 'important'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      addToast('Please select a file (PDF, DOC, or DOCX)', 'error');
      return;
    }
    if (!department || !semester) {
      addToast('Please select department and semester', 'error');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subject', subject);
      formData.append('department', department);
      formData.append('semester', semester);
      formData.append('isImportantForExam', isImportantForExam);
      if (examTags.length > 0) {
        formData.append('examTags', JSON.stringify(examTags));
      }
      if (syllabusUnit) {
        formData.append('syllabusUnit', syllabusUnit);
      }
      formData.append('file', file);
      await notesAPI.upload(formData);
      addToast('Note uploaded successfully', 'success');
      setTitle('');
      setSubject('');
      setDepartment('');
      setSemester('');
      setIsImportantForExam(false);
      setExamTags([]);
      setSyllabusUnit('');
      setFile(null);
      const input = document.getElementById('file-input');
      if (input) input.value = '';
    } catch (err) {
      addToast(err.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setLoading(false);
      setDragActive(false);
    }
  };

  const toggleExamTag = (tag) => {
    setExamTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleFileSelect = (selected) => {
    if (!selected) return;
    setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    handleFileSelect(dropped);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50">Upload Notes</h1>
        <p className="text-sm text-slate-400">
          Drag &amp; drop your PDFs, DOC, or DOCX files or use the upload button.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-white/10 bg-[#111827]/80 p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.9)] backdrop-blur-xl"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40"
                placeholder="e.g. Calculus Notes - Chapter 1"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40"
                placeholder="e.g. Mathematics, Physics"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40"
                required
              >
                <option value="">Select</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40"
                required
              >
                <option value="">Select</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Syllabus Unit
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={syllabusUnit}
                onChange={(e) => setSyllabusUnit(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40"
                placeholder="1-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="exam-important"
                checked={isImportantForExam}
                onChange={(e) => setIsImportantForExam(e.target.checked)}
                className="h-4 w-4 rounded border-white/10 bg-slate-950/40 text-purple-500 focus:ring-2 focus:ring-purple-500/40"
              />
              <label htmlFor="exam-important" className="text-sm text-slate-300 cursor-pointer">
                Mark as important for exams
              </label>
            </div>
            
            {isImportantForExam && (
              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  Exam Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {examTagOptions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleExamTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        examTags.includes(tag)
                          ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:bg-white/5'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drag & drop area */}
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              File (PDF, DOC, DOCX)
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center text-sm transition-all ${
                dragActive
                  ? 'border-purple-400 bg-purple-500/10 shadow-[0_0_40px_rgba(168,85,247,0.6)]'
                  : 'border-slate-600/60 bg-slate-950/40 hover:border-purple-400/70 hover:bg-purple-500/5'
              }`}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300 shadow-[0_0_24px_rgba(168,85,247,0.35)] group-hover:bg-purple-500/25">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                >
                  <HiOutlineCloudArrowUp className="text-2xl" />
                </motion.div>
              </div>
              <p className="text-slate-200">
                {file ? (
                  <span className="font-medium text-purple-300">{file.name}</span>
                ) : (
                  <>
                    <span className="font-medium text-slate-100">Drop your file here</span>{' '}
                    <span className="text-slate-500">or click to browse</span>
                  </>
                )}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Supported formats: PDF, DOC, DOCX (max 10MB)
              </p>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div className="pt-2">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(168,85,247,0.55)] transition-all disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
              {loading ? 'Uploading...' : 'Upload note'}
            </motion.button>
          </div>
        </motion.form>

        {/* Illustration panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-slate-900/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.9)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.15),transparent_50%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.2),transparent_55%)] opacity-80" />
          <div className="relative space-y-4">
            <h2 className="text-lg font-semibold text-slate-50">Upload Notes Interface</h2>
            <p className="text-sm text-slate-400">
              Drag and drop your notes into a secure, backend-driven storage system. NEXNOTE keeps
              files organized while presenting them in a clean, student-friendly interface.
            </p>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <img
                src="/upload illustration.png"
                alt="Upload notes interface"
                className="h-full w-full object-contain rounded-lg"
                onError={(e) => {
                  // Fallback to undraw illustration if custom image not found
                  e.target.src = "https://images.undraw.co/illustrations/add-document-dark.svg";
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
