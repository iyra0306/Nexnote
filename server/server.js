import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { setIO } from './socket.js';
import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import userRoutes from './routes/userRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';

// ── Env validation ────────────────────────────────────────────────────────────
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 4) {
  console.warn('⚠️  JWT_SECRET is missing or too short. Set a strong secret in server/.env');
}
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in server/.env');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// ── Socket.io ─────────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
setIO(io);   // store singleton - no circular imports

connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5001',
  'http://localhost:5000',
  'http://localhost:3000',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ ok: true, message: 'NEXNOTE server is running', timestamp: new Date() })
);

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Serve React build ─────────────────────────────────────────────────────────
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
  if (path.extname(req.path)) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

// ── Centralized error handler ─────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('❌ Server error:', err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
});

// ── Socket.io events ──────────────────────────────────────────────────────────
let onlineUsers = 0;

io.on('connection', (socket) => {
  onlineUsers++;
  io.emit('onlineUsers', onlineUsers);
  console.log(`🔌 Connected: ${socket.id} | Online: ${onlineUsers}`);

  socket.on('joinRoom', (userId) => {
    if (userId && typeof userId === 'string') {
      socket.join(userId);
    }
  });

  socket.on('joinDepartment', (department) => {
    if (department && typeof department === 'string') {
      socket.join(`dept_${department}`);
    }
  });

  socket.on('disconnect', () => {
    onlineUsers = Math.max(0, onlineUsers - 1);
    io.emit('onlineUsers', onlineUsers);
    console.log(`❌ Disconnected: ${socket.id} | Online: ${onlineUsers}`);
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Open browser: http://localhost:${PORT}/login`);
  console.log(`✅ Socket.io enabled`);
});
