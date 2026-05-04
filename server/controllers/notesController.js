import Note from '../models/Note.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getIO } from '../socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// POST /api/notes
export const uploadNote = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { title, subject, category, tags, department, semester,
            isImportantForExam, examTags, syllabusTopics, syllabusUnit } = req.body;

    if (!title?.trim() || !subject?.trim())
      return res.status(400).json({ message: 'Title and subject are required' });

    if (title.trim().length > 200)
      return res.status(400).json({ message: 'Title must be under 200 characters' });

    // Parse examTags safely
    let parsedExamTags = [];
    if (examTags) {
      try { parsedExamTags = typeof examTags === 'string' ? JSON.parse(examTags) : examTags; }
      catch { parsedExamTags = examTags.split(',').map(t => t.trim()).filter(Boolean); }
    }

    const note = await Note.create({
      title: title.trim(),
      subject: subject.trim(),
      department: department || req.user.department || 'Other',
      semester: parseInt(semester) || req.user.semester || 1,
      category: category || 'General',
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : tags) : [],
      isImportantForExam: isImportantForExam === 'true' || isImportantForExam === true,
      examTags: parsedExamTags,
      syllabusTopics: syllabusTopics
        ? (typeof syllabusTopics === 'string' ? syllabusTopics.split(',').map(t => t.trim()).filter(Boolean) : syllabusTopics)
        : [],
      syllabusUnit: syllabusUnit ? parseInt(syllabusUnit) : undefined,
      fileURL: req.file.filename,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
    });

    // Award points
    req.user.points = (req.user.points || 0) + 10;
    await req.user.save();

    // Real-time notifications
    const io = getIO();
    if (io) {
      io.to(`dept_${note.department}`).emit('newNote', {
        id: note._id, title: note.title, subject: note.subject,
        department: note.department, uploadedBy: req.user.name,
        message: `📚 New note: "${note.title}" by ${req.user.name}`,
      });
      io.emit('noteUploaded', { total: await Note.countDocuments() });
    }

    // Return note + updated user points so frontend can update XP display
    res.status(201).json({
      ...note.toObject(),
      _userPoints: req.user.points,   // ← send updated points back
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// GET /api/notes
export const getAllNotes = async (req, res) => {
  try {
    const { department, semester, isImportantForExam, subject } = req.query;
    const query = {};
    if (department) query.department = department;
    if (semester) query.semester = parseInt(semester);
    if (isImportantForExam === 'true') query.isImportantForExam = true;
    if (subject) query.subject = new RegExp(subject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    const notes = await Note.find(query)
      .populate('uploadedBy', 'name email avatar isVerified')
      .populate('comments.user', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Only uploader or admin can delete
    if (note.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    // Delete physical file
    const filePath = path.join(__dirname, '../uploads', note.fileURL);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// GET /api/notes/:id/download
export const downloadNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const filePath = path.join(__dirname, '../uploads', note.fileURL);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found on server' });

    note.downloads = (note.downloads || 0) + 1;
    await note.save();

    const filename = `${note.title}${path.extname(note.fileURL)}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.download(filePath, filename);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// GET /api/notes/stats
export const getStats = async (req, res) => {
  try {
    const [totalNotes, dlAgg, viewAgg, topNotes, notesBySubject] = await Promise.all([
      Note.countDocuments(),
      Note.aggregate([{ $group: { _id: null, total: { $sum: '$downloads' } } }]),
      Note.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      Note.find().sort({ downloads: -1 }).limit(5).populate('uploadedBy', 'name email'),
      Note.aggregate([{ $group: { _id: '$subject', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    ]);
    res.json({
      totalNotes,
      totalDownloads: dlAgg[0]?.total || 0,
      totalViews: viewAgg[0]?.total || 0,
      topNotes,
      notesBySubject,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// GET /api/notes/:id
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('uploadedBy', 'name email avatar')
      .populate('comments.user', 'name email avatar');
    if (!note) return res.status(404).json({ message: 'Note not found' });
    note.views = (note.views || 0) + 1;
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
