import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  HiMagnifyingGlass,
  HiXMark,
  HiOutlineDocumentText,
} from 'react-icons/hi2';
import { notesAPI } from '../api/api';
import { useToast } from '../components/Toast';
import NoteCard from '../components/NoteCard';

export default function ViewNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [examModeOnly, setExamModeOnly] = useState(false);
  const [sortBy, setSortBy] = useState('date-desc');
  const { addToast } = useToast();

  const departments = ['CSE', 'ECE', 'Mechanical', 'Civil', 'IT', 'EEE', 'Chemical', 'Biotechnology', 'Other'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const fetchNotes = async () => {
    try {
      const { data } = await notesAPI.getAll();
      setNotes(data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load notes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const subjects = useMemo(() => {
    const unique = [...new Set(notes.map((n) => n.subject))];
    return unique.sort();
  }, [notes]);

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    if (searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter((note) => note.subject === selectedSubject);
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter((note) => note.department === selectedDepartment);
    }

    if (selectedSemester !== 'all') {
      filtered = filtered.filter((note) => note.semester === parseInt(selectedSemester));
    }

    if (examModeOnly) {
      filtered = filtered.filter((note) => note.isImportantForExam);
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case 'date-desc':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'title-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'rating-desc':
        sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      default:
        break;
    }

    return sorted;
  }, [notes, searchQuery, selectedSubject, selectedDepartment, selectedSemester, examModeOnly, sortBy]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await notesAPI.delete(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      addToast('Note deleted successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const handleNoteUpdate = (updatedNote) => {
    setNotes(prev => prev.map(n => n._id === updatedNote._id ? updatedNote : n));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-slate-400">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50">View Notes</h1>
        <p className="text-sm text-slate-400">
          Browse, download, rate, and comment on notes
        </p>
      </motion.div>

      {/* Search and filters */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title or subject..."
            className="w-full rounded-xl border border-white/10 bg-slate-950/40 pl-11 pr-10 py-3 text-sm text-slate-100 outline-none ring-0 transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <HiXMark className="text-slate-400 text-lg" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Department:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDepartment('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDepartment === 'all'
                    ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:bg-white/5'
                }`}
              >
                All
              </button>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedDepartment === dept
                      ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:bg-white/5'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Semester:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSemester('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSemester === 'all'
                    ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:bg-white/5'
                }`}
              >
                All
              </button>
              {semesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem.toString())}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedSemester === sem.toString()
                      ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:bg-white/5'
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setExamModeOnly(!examModeOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                examModeOnly
                  ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-500/40'
                  : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:bg-white/5'
              }`}
            >
              <span>🎯</span>
              Exam Mode
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Subject:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSubject('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSubject === 'all'
                    ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:bg-white/5'
                }`}
              >
                All ({notes.length})
              </button>
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedSubject === subject
                      ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:bg-white/5'
                  }`}
                >
                  {subject} ({notes.filter((n) => n.subject === subject).length})
                </button>
              ))}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/60 text-slate-300 border border-white/5 hover:bg-white/5 outline-none cursor-pointer"
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="rating-desc">Highest rated</option>
            </select>
          </div>
        </div>

        {(searchQuery || selectedSubject !== 'all' || selectedDepartment !== 'all' || selectedSemester !== 'all' || examModeOnly) && (
          <p className="text-xs text-slate-500">
            Showing {filteredAndSortedNotes.length} of {notes.length} notes
          </p>
        )}
      </motion.div>

      {/* Notes grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full"
          >
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-slate-900/80 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.9)]">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1 text-center lg:text-left space-y-4">
                  <div className="h-16 w-16 mx-auto lg:mx-0 rounded-2xl bg-slate-900/60 flex items-center justify-center">
                    <HiOutlineDocumentText className="text-3xl text-slate-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-slate-300">
                      {notes.length === 0 ? 'No notes yet' : 'No notes found'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {notes.length === 0
                        ? 'Upload some from the Upload Notes page to get started'
                        : 'Try adjusting your search or filters to find what you need'}
                    </p>
                  </div>
                </div>
                <div className="flex-1 max-w-md">
                  <img
                    src="/studying-illustration.png"
                    alt="Studying illustration"
                    className="w-full h-auto object-contain rounded-2xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          filteredAndSortedNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={handleDelete}
              onUpdate={handleNoteUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}
