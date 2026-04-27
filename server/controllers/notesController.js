import Note from '../models/Note.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { io } from '../server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * POST /api/notes - Upload note (file + metadata)
 */
export const uploadNote = async (req, res) => {
  try {
    console.log('=== Upload Note Request ===');
    console.log('User:', req.user?.email, 'Role:', req.user?.role);
    console.log('File:', req.file ? req.file.filename : 'NO FILE');
    console.log('Body:', req.body);
    
    if (!req.file) {
      console.log('ERROR: No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const { title, subject, category, tags, department, semester, isImportantForExam, examTags, syllabusTopics, syllabusUnit } = req.body;
    
    if (!title || !subject) {
      console.log('ERROR: Missing title or subject');
      return res.status(400).json({ message: 'Title and subject required' });
    }
    
    // Parse examTags if it's a JSON string
    let parsedExamTags = [];
    if (examTags) {
      try {
        parsedExamTags = typeof examTags === 'string' ? JSON.parse(examTags) : examTags;
      } catch (e) {
        parsedExamTags = examTags.split(',').map(tag => tag.trim());
      }
    }
    
    const noteData = {
      title,
      subject,
      department: department || req.user.department || 'Other',
      semester: semester || req.user.semester || 1,
      category: category || 'General',
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags) : [],
      isImportantForExam: isImportantForExam === 'true' || isImportantForExam === true,
      examTags: parsedExamTags,
      syllabusTopics: syllabusTopics ? (typeof syllabusTopics === 'string' ? syllabusTopics.split(',').map(topic => topic.trim()) : syllabusTopics) : [],
      syllabusUnit: syllabusUnit ? parseInt(syllabusUnit) : undefined,
      fileURL: req.file.filename,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
    };
    
    console.log('Creating note with data:', noteData);
    
    const note = await Note.create(noteData);
    
    console.log('Note created successfully:', note._id);
    
    // Award points for uploading
    req.user.points += 10;
    await req.user.save();

    // 🔴 Real-time: notify all users in the department
    io.to(`dept_${note.department}`).emit('newNote', {
      id: note._id,
      title: note.title,
      subject: note.subject,
      department: note.department,
      semester: note.semester,
      uploadedBy: req.user.name,
      message: `📚 New note uploaded: "${note.title}" by ${req.user.name}`,
    });

    // Also notify everyone (for dashboard live count)
    io.emit('noteUploaded', { total: await Note.countDocuments() });
    
    res.status(201).json(note);
  } catch (error) {
    console.error('=== Upload Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * GET /api/notes - Get all notes (for students/view)
 */
export const getAllNotes = async (req, res) => {
  try {
    const { department, semester, isImportantForExam, subject } = req.query;
    
    const query = {};
    if (department) query.department = department;
    if (semester) query.semester = parseInt(semester);
    if (isImportantForExam === 'true') query.isImportantForExam = true;
    if (subject) query.subject = new RegExp(subject, 'i');
    
    const notes = await Note.find(query)
      .populate('uploadedBy', 'name email avatar isVerified')
      .populate('comments.user', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * DELETE /api/notes/:id - Delete note (and file)
 */
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    const filePath = path.join(__dirname, '../uploads', note.fileURL);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * GET /api/notes/:id/download - Download note file
 */
export const downloadNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    
    // Increment download count
    note.downloads += 1;
    await note.save();
    
    const filePath = path.join(__dirname, '../uploads', note.fileURL);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
    res.download(filePath, `${note.title}${path.extname(note.fileURL)}`);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * GET /api/notes/:id - Get single note with details
 */
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('uploadedBy', 'name email avatar')
      .populate('comments.user', 'name email avatar');
    
    if (!note) return res.status(404).json({ message: 'Note not found' });
    
    // Increment view count
    note.views += 1;
    await note.save();
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * GET /api/notes/stats - Get statistics
 */
export const getStats = async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments();
    const totalDownloads = await Note.aggregate([
      { $group: { _id: null, total: { $sum: '$downloads' } } }
    ]);
    const totalViews = await Note.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    
    const topNotes = await Note.find()
      .sort({ downloads: -1 })
      .limit(5)
      .populate('uploadedBy', 'name email');
    
    const notesBySubject = await Note.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      totalNotes,
      totalDownloads: totalDownloads[0]?.total || 0,
      totalViews: totalViews[0]?.total || 0,
      topNotes,
      notesBySubject,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
