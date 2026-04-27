import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import userRoutes from './routes/userRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);   // wrap express in HTTP server

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make io accessible in controllers via req.app.get('io')
app.set('io', io);

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5001', credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, message: 'NEXNOTE server is running' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve React app
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
  if (path.extname(req.path)) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
});

// ─── Socket.io Events ────────────────────────────────────────────────────────
let onlineUsers = 0;

io.on('connection', (socket) => {
  onlineUsers++;
  console.log(`🔌 User connected: ${socket.id} | Online: ${onlineUsers}`);

  // Broadcast updated online count to everyone
  io.emit('onlineUsers', onlineUsers);

  // User joins their personal room (for targeted notifications)
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined their room`);
  });

  // User joins department room (for department-specific notifications)
  socket.on('joinDepartment', (department) => {
    socket.join(`dept_${department}`);
    console.log(`🏫 User joined department: ${department}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    onlineUsers = Math.max(0, onlineUsers - 1);
    io.emit('onlineUsers', onlineUsers);
    console.log(`❌ User disconnected: ${socket.id} | Online: ${onlineUsers}`);
  });
});

// Export io so controllers can emit events
export { io };

const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Open browser: http://localhost:${PORT}/login`);
  console.log(`✅ Socket.io enabled for real-time features`);
});
