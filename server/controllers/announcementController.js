import Announcement from '../models/Announcement.js';
import { io } from '../server.js';

/**
 * POST /api/announcements - Create announcement (admin/teacher only)
 */
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, department, semester, priority, expiresAt, isPinned } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const announcement = await Announcement.create({
      title,
      content,
      department: department || 'All',
      semester: semester || 0,
      priority: priority || 'normal',
      expiresAt,
      isPinned: isPinned || false,
      createdBy: req.user._id,
    });
    
    const populated = await Announcement.findById(announcement._id)
      .populate('createdBy', 'name email role');

    // 🔴 Real-time: notify all users about new announcement
    const target = announcement.department === 'All' ? null : `dept_${announcement.department}`;
    const event = {
      id: populated._id,
      title: populated.title,
      priority: populated.priority,
      department: populated.department,
      createdBy: req.user.name,
      message: `📢 New announcement: "${populated.title}" by ${req.user.name}`,
    };
    if (target) {
      io.to(target).emit('newAnnouncement', event);
    } else {
      io.emit('newAnnouncement', event);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * GET /api/announcements - Get all active announcements
 */
export const getAnnouncements = async (req, res) => {
  try {
    const { department, semester } = req.query;
    
    const query = { 
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    };
    
    // Filter by department if provided
    if (department && department !== 'All') {
      query.$and = [
        { $or: [{ department: 'All' }, { department }] }
      ];
    }
    
    // Filter by semester if provided
    if (semester) {
      if (!query.$and) query.$and = [];
      query.$and.push({
        $or: [{ semester: 0 }, { semester: parseInt(semester) }]
      });
    }
    
    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name email role')
      .sort({ isPinned: -1, createdAt: -1 });
    
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * GET /api/announcements/:id - Get single announcement
 */
export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name email role');
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * PUT /api/announcements/:id - Update announcement
 */
export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    // Only creator or admin can update
    if (announcement.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this announcement' });
    }
    
    const { title, content, department, semester, priority, expiresAt, isPinned, isActive } = req.body;
    
    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (department) announcement.department = department;
    if (semester !== undefined) announcement.semester = semester;
    if (priority) announcement.priority = priority;
    if (expiresAt !== undefined) announcement.expiresAt = expiresAt;
    if (isPinned !== undefined) announcement.isPinned = isPinned;
    if (isActive !== undefined) announcement.isActive = isActive;
    
    await announcement.save();
    
    const updated = await Announcement.findById(announcement._id)
      .populate('createdBy', 'name email role');
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * DELETE /api/announcements/:id - Delete announcement
 */
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    // Only creator or admin can delete
    if (announcement.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this announcement' });
    }
    
    await Announcement.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
