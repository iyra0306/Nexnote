import Note from '../models/Note.js';

// POST /api/notes/:id/comments
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '')
      return res.status(400).json({ message: 'Comment text is required' });
    if (text.trim().length > 500)
      return res.status(400).json({ message: 'Comment must be under 500 characters' });

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.comments.push({ user: req.user._id, text: text.trim() });
    await note.save();

    const updated = await Note.findById(req.params.id)
      .populate('comments.user', 'name email avatar')
      .populate('uploadedBy', 'name email');

    res.status(201).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// DELETE /api/notes/:id/comments/:commentId
export const deleteComment = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const comment = note.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.deleteOne();
    await note.save();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// POST /api/notes/:id/ratings
export const addRating = async (req, res) => {
  try {
    const rating = parseInt(req.body.rating);
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const existing = note.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (existing) {
      existing.rating = rating;
    } else {
      note.ratings.push({ user: req.user._id, rating });
    }

    // ✅ Fixed: await the calculation
    if (typeof note.calculateAverageRating === 'function') {
      note.calculateAverageRating();
    } else {
      // Fallback manual calculation
      const total = note.ratings.reduce((sum, r) => sum + r.rating, 0);
      note.averageRating = note.ratings.length ? total / note.ratings.length : 0;
    }

    await note.save();
    res.json({ message: 'Rating saved', averageRating: note.averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
