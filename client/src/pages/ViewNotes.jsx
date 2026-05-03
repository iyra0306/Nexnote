import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMagnifyingGlass, HiXMark, HiOutlineFire, HiOutlineTrophy } from 'react-icons/hi2';
import { notesAPI } from '../api/api';
import { useToast } from '../components/Toast';
import NoteCard from '../components/NoteCard';

const departments = ['CSE', 'ECE', 'Mechanical', 'Civil', 'IT', 'EEE', 'Chemical', 'Biotechnology', 'Other'];
const semesters   = [1, 2, 3, 4, 5, 6, 7, 8];

export default function ViewNotes() {
  const [notes, setNotes]                       = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedSubject, setSelectedSubject]   = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [examModeOnly, setExamModeOnly]         = useState(false);
  const [sortBy, setSortBy]                     = useState('date-desc');
  const { addToast } = useToast();

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await notesAPI.getAll();
      setNotes(data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load notes', 'error');
    } finally { setLoading(false); }
  };

  const subjects = useMemo(() => [...new Set(notes.map(n => n.subject))].sort(), [notes]);

  const filtered = useMemo(() => {
    let f = notes;
    if (searchQuery)           f = f.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedSubject !== 'all')    f = f.filter(n => n.subject === selectedSubject);
    if (selectedDepartment !== 'all') f = f.filter(n => n.department === selectedDepartment);
    if (selectedSemester !== 'all')   f = f.filter(n => n.semester === parseInt(selectedSemester));
    if (examModeOnly)          f = f.filter(n => n.isImportantForExam);
    const s = [...f];
    if (sortBy === 'date-desc')   s.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === 'date-asc')    s.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === 'title-asc')   s.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === 'title-desc')  s.sort((a, b) => b.title.localeCompare(a.title));
    if (sortBy === 'rating-desc') s.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    return s;
  }, [notes, searchQuery, selectedSubject, selectedDepartment, selectedSemester, examModeOnly, sortBy]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await notesAPI.delete(id);
      setNotes(prev => prev.filter(n => n._id !== id));
      addToast('Note deleted', 'success');
    } catch (err) { addToast(err.response?.data?.message || 'Delete failed', 'error'); }
  };

  const handleNoteUpdate = (updated) => setNotes(prev => prev.map(n => n._id === updated._id ? updated : n));

  const btnClass = (active) => `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
    active
      ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
      : 'bg-[#0f0f25] text-slate-500 border border-white/5 hover:border-amber-500/20 hover:text-slate-300'
  }`;

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="text-4xl">⚔️</motion.div>
      <p className="text-amber-400 font-bold animate-pulse">Loading the Library...</p>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📚</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-50">Note Library</h1>
            <p className="text-sm text-amber-600/70 font-semibold">Browse, download & earn XP</p>
          </div>
          <div className="ml-auto flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-2">
            <HiOutlineTrophy className="text-amber-400" />
            <span className="text-sm font-black text-amber-400">{notes.length}</span>
            <span className="text-xs text-amber-600">scrolls</span>
          </div>
        </div>
      </motion.div>

      {/* Exam Mode Banner */}
      <AnimatePresence>
        {examModeOnly && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-orange-500/10 p-4 flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="text-sm font-black text-amber-300">EXAM MODE ACTIVE</p>
              <p className="text-xs text-amber-600">Showing only exam-critical notes</p>
            </div>
            <button onClick={() => setExamModeOnly(false)} className="ml-auto text-amber-500 hover:text-amber-300">
              <HiXMark className="text-xl" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search + Filters */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="space-y-4 rounded-2xl border border-amber-500/10 bg-[#0d0d20] p-4">

        {/* Search */}
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 text-lg" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search scrolls by title or subject..."
            className="w-full rounded-xl border border-amber-500/20 bg-slate-950/60 pl-11 pr-10 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 placeholder:text-slate-600" />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10">
              <HiXMark className="text-amber-600 text-lg" />
            </button>
          )}
        </div>

        {/* Department */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">🏛️ Department</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedDepartment('all')} className={btnClass(selectedDepartment === 'all')}>All</button>
            {departments.map(d => <button key={d} onClick={() => setSelectedDepartment(d)} className={btnClass(selectedDepartment === d)}>{d}</button>)}
          </div>
        </div>

        {/* Semester + Exam Mode */}
        <div className="flex flex-wrap items-start gap-4">
          <div className="space-y-2 flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">📅 Semester</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedSemester('all')} className={btnClass(selectedSemester === 'all')}>All</button>
              {semesters.map(s => <button key={s} onClick={() => setSelectedSemester(s.toString())} className={btnClass(selectedSemester === s.toString())}>S{s}</button>)}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">⚡ Mode</p>
            <motion.button onClick={() => setExamModeOnly(!examModeOnly)}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                examModeOnly
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                  : 'border border-amber-500/20 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10'
              }`}>
              <HiOutlineFire className="text-base" />
              🎯 Exam Mode
            </motion.button>
          </div>
        </div>

        {/* Subject + Sort */}
        <div className="flex flex-wrap items-start gap-4">
          <div className="space-y-2 flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">📖 Subject</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedSubject('all')} className={btnClass(selectedSubject === 'all')}>All ({notes.length})</button>
              {subjects.map(s => <button key={s} onClick={() => setSelectedSubject(s)} className={btnClass(selectedSubject === s)}>{s} ({notes.filter(n => n.subject === s).length})</button>)}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">⬆️ Sort</p>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#0f0f25] text-amber-400 border border-amber-500/20 outline-none cursor-pointer">
              <option value="date-desc">⬇️ Newest</option>
              <option value="date-asc">⬆️ Oldest</option>
              <option value="title-asc">🔤 A-Z</option>
              <option value="rating-desc">⭐ Top Rated</option>
            </select>
          </div>
        </div>

        {(searchQuery || selectedSubject !== 'all' || selectedDepartment !== 'all' || selectedSemester !== 'all' || examModeOnly) && (
          <p className="text-xs text-amber-600 font-semibold">
            ⚔️ Showing {filtered.length} of {notes.length} scrolls
          </p>
        )}
      </motion.div>

      {/* Notes Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="col-span-full">
            <div className="rounded-3xl border border-amber-500/10 bg-[#0d0d20] p-12 text-center space-y-4">
              <div className="text-6xl">📭</div>
              <p className="text-xl font-black text-slate-300">
                {notes.length === 0 ? 'The Library is Empty!' : 'No Scrolls Found!'}
              </p>
              <p className="text-sm text-slate-500">
                {notes.length === 0 ? 'A teacher must upload the first scroll to begin the quest!' : 'Try different filters to find your scroll.'}
              </p>
              <img src="/studying illustration.png.png" alt="Empty" className="mx-auto max-w-xs rounded-2xl opacity-60"
                onError={(e) => e.target.style.display='none'} />
            </div>
          </motion.div>
        ) : (
          filtered.map((note, i) => (
            <motion.div key={note._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}>
              <NoteCard note={note} onDelete={handleDelete} onUpdate={handleNoteUpdate} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
