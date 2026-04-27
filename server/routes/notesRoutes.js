import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { upload, handleUploadError } from '../middleware/upload.js';
import {
  uploadNote, getAllNotes, deleteNote, downloadNote, getNoteById, getStats,
} from '../controllers/notesController.js';
import { addComment, deleteComment, addRating } from '../controllers/commentController.js';

const router = express.Router();

// Public routes
router.get('/', getAllNotes);
router.get('/stats', getStats);
router.get('/:id', getNoteById);
router.get('/:id/download', downloadNote);

// Protected routes (teachers/admin only for upload/delete)
router.post('/', protect, authorize('teacher', 'admin'), upload.single('file'), handleUploadError, uploadNote);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteNote);

// Comments & ratings (all authenticated users)
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);
router.post('/:id/ratings', protect, addRating);

export default router;
