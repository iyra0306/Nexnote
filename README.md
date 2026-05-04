# ⚔️ NEXNOTE — Study RPG

> **Study Smart, Manage Better** · A gamified college notes management platform built with MERN stack

![Node.js](https://img.shields.io/badge/Node.js-v24-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Local-green)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-3.0_Gamified-orange)

---

## 🎮 What is NEXNOTE?

NEXNOTE is a **gamified college notes management system** where students and teachers earn XP, unlock badges, and climb rank ladders — all while sharing and accessing study materials.

Built specifically for **Chitkara University** students, organized by department and semester.

---

## 🏆 Gamification System

| Action | XP Earned |
|--------|-----------|
| ⚔️ Upload a note | +10 XP |
| ⬇️ Download a note | +5 XP |
| ⭐ Rate a note | +3 XP |
| 💬 Comment on a note | +2 XP |
| 💎 Add to favorites | +2 XP |
| ✉️ Message uploader | +2 XP |

### 🎖️ Rank Ladder
| Rank | XP Required |
|------|-------------|
| 🌱 Novice | 0 XP |
| 📖 Scholar | 50 XP |
| ⚡ Adept | 150 XP |
| 🔮 Expert | 300 XP |
| 👑 Master | 500 XP |
| 🌟 Legend | 999 XP |

---

## ✨ Features

### 🎮 Gamified Experience
- **XP System** — Earn points for every action
- **Rank Progression** — 6 ranks from Novice to Legend
- **Achievement Badges** — Note Warrior, Scholar, Collector, On Fire, Commentator, Critic
- **Daily Quests** — Upload, download, rate, comment
- **XP Bar** — Live progress bar in sidebar
- **Daily Streak** — Track consecutive days active

### 🧙 Avatar System (Snapchat-style)
- **DiceBear Avataaars** — Real cartoon character avatars
- **48 preset characters** — Pick from preset seeds
- **10 avatar styles** — Cartoon, Pixel, Robot, Emoji, Doodle and more
- **12 backgrounds** — Gradient color options
- **Custom seed** — Type any name to generate unique avatar
- **🎲 Randomize** — One-click random character
- Shows in sidebar, top bar, and profile

### 🤖 NEXUS AI — Study Companion
- Built-in AI chatbot (no external API needed)
- Answers questions about: Math, Physics, Chemistry, Programming, CSE, ECE
- Exam preparation tips and study techniques
- NEXNOTE feature guidance
- Stress management advice
- Floating button on all pages

### 📚 Notes Management
- Upload PDF, DOC, DOCX (max 10MB)
- Filter by Department, Semester, Subject
- 🎯 **Exam Mode** — Show only exam-critical notes
- Search by title or subject
- Sort by date, title, or rating
- Download with one click
- View/download counters

### ✉️ Message Uploader
- Students can message note uploaders directly
- 4 message types: Suggestion, Correction, Question, Appreciation
- Messages appear as tagged comments
- Earn +2 XP for sending feedback

### 📣 Announcements (Guild Chat)
- Create announcements targeted by department/semester
- Priority levels: 🚨 Urgent, 📢 Normal, 💡 Info
- Teachers earn +5 XP for posting

### 📊 Analytics (Stats Board)
- Total notes, downloads, views
- 🏆 Leaderboard with medal rankings
- Notes by subject with progress bars
- Animated counters

### 👤 User Profiles (My Character)
- Full character card with XP ring
- 6 achievement badges
- Animated XP progress bar
- Edit profile and change password
- Avatar builder integrated

### 🔐 Authentication
- JWT-based authentication (30-day tokens)
- Role-based access: Student, Teacher, Admin
- Token expiry detection
- Secure password hashing (bcrypt, 12 rounds)

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js v24 | Runtime |
| Express.js | Web framework |
| MongoDB (Local) | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Multer | File uploads |
| bcryptjs | Password hashing |
| Socket.io | Real-time features |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI library |
| Vite 5 | Build tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Router v6 | Routing |
| Axios | HTTP client |
| DiceBear API | Avatar generation |
| React Icons (hi2) | Icons |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local installation)
- MongoDB Compass (recommended for viewing data)

### 1. Clone
```bash
git clone https://github.com/iyra0317/Nexnote.git
cd Nexnote
```

### 2. Install Dependencies
```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3. Environment Variables

**`server/.env`:**
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/nexnote
JWT_SECRET=iyra
CLIENT_URL=http://localhost:5001
```

**`client/.env`:**
```env
VITE_API_URL=http://localhost:5001/api
```

### 4. Start MongoDB
```bash
# Windows - start MongoDB service
net start MongoDB
```

### 5. Build Frontend
```bash
cd client
npm run build
```

### 6. Start Server
```bash
cd server
npm start
```

### 7. Open Browser
```
http://localhost:5001/login
```

---

## 📱 Pages

| Route | Name | Access |
|-------|------|--------|
| `/login` | Enter the Arena | Public |
| `/signup` | Create Character | Public |
| `/dashboard` | Home Base | All |
| `/upload` | Upload Quest | Teacher/Admin |
| `/notes` | Note Library | All |
| `/favorites` | Saved Loot | All |
| `/analytics` | Stats Board | Teacher/Admin |
| `/announcements` | Guild Chat | All |
| `/profile` | My Character | All |
| `/about` | About | All |
| `/contact` | Contact Guild | All |

---

## 🔐 User Roles

### 🎓 Student
- Browse and download notes
- Filter by department/semester/exam mode
- Rate and comment on notes
- Add to favorites
- Message note uploaders
- View announcements
- Earn XP for all actions

### ⚔️ Teacher
- All student features
- Upload notes with exam tags and syllabus mapping
- Create targeted announcements
- View analytics and leaderboard
- Delete own notes

### 🛡️ Admin
- All teacher features
- Full system access

---

## 📂 Project Structure

```
Nexnote/
├── client/                    # React Frontend
│   ├── public/               # Static assets
│   │   ├── nexnote-logo.png
│   │   ├── upload illustration.png
│   │   └── studying illustration.png.png
│   ├── src/
│   │   ├── api/              # Axios API calls
│   │   │   └── api.js
│   │   ├── components/       # Reusable components
│   │   │   ├── AvatarBuilder.jsx   # Snapchat-style avatar
│   │   │   ├── Layout.jsx          # Sidebar + navigation
│   │   │   ├── NexusAI.jsx         # AI chatbot
│   │   │   ├── NoteCard.jsx        # Note display card
│   │   │   ├── NoteMessage.jsx     # Message uploader
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── StarRating.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Auth + XP sync
│   │   │   └── SocketContext.jsx   # Real-time
│   │   ├── pages/            # 11 pages
│   │   │   ├── About.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Announcements.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── UploadNotes.jsx
│   │   │   └── ViewNotes.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── announcementController.js
│   │   ├── authController.js
│   │   ├── commentController.js  # XP for comments/ratings
│   │   ├── notesController.js    # XP for uploads
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   └── upload.js         # Multer file handling
│   ├── models/
│   │   ├── Announcement.js
│   │   ├── Note.js
│   │   └── User.js           # Points, badges, streak
│   ├── routes/
│   ├── socket.js             # Socket.io singleton
│   ├── uploads/              # Uploaded files
│   └── server.js
│
└── Documentation/
    ├── README.md                    ← You are here
    ├── TEAM_SETUP_GUIDE.md         ← For teammates
    ├── TEAMMATE_COMPLETE_GUIDE.md  ← Full setup guide
    ├── COLLEGE_PITCH_GUIDE.md      ← Presentation guide
    └── CHECKLIST.md
```

---

## 🔌 API Endpoints

### Auth
```
POST /api/auth/signup   Register user
POST /api/auth/login    Login, returns JWT + user with points
```

### Notes
```
GET    /api/notes                    Get all notes (filterable)
POST   /api/notes                    Upload note (+10 XP)
GET    /api/notes/stats              Analytics stats
GET    /api/notes/:id/download       Download file
DELETE /api/notes/:id                Delete note
POST   /api/notes/:id/comments       Add comment (+2 XP)
DELETE /api/notes/:id/comments/:cid  Delete comment
POST   /api/notes/:id/ratings        Rate note (+3 XP)
```

### Users
```
GET  /api/users/profile         Get profile (with latest points)
PUT  /api/users/profile         Update profile
PUT  /api/users/change-password Change password
GET  /api/users/favorites       Get favorites
POST /api/users/favorites/:id   Toggle favorite
```

### Announcements
```
GET    /api/announcements     Get all
POST   /api/announcements     Create (+5 XP)
DELETE /api/announcements/:id Delete
```

### Health
```
GET /api/health   Server status check
```

---

## 🐛 Troubleshooting

### Port in use
```bash
npx kill-port 5001
```

### MongoDB not connecting
```bash
# Check service is running
net start MongoDB
# Connect in Compass: mongodb://localhost:27017
```

### Build errors
```bash
cd client
rm -rf node_modules
npm install && npm run build
```

### Avatar not showing
- Requires internet connection (DiceBear API)
- Falls back to colored initial letter if offline

---

## 👥 Team

| Name | Role | Focus |
|------|------|-------|
| **Iyra** | Backend Developer | APIs, Auth, Deployment |
| **Neeti** | Project Lead & Frontend | React, UI/UX, Coordination |
| **Manleen** | Database Administrator | MongoDB, Integration |
| **Eknoor** | QA & Documentation | Testing, Guides |

**Contact**: iyra0367.becse24@chitkara.edu.in  
**GitHub**: https://github.com/iyra0317/Nexnote

---

## 📄 License

MIT License — Free to use, modify, and distribute.

---

**Version**: 3.0 (Gamified Edition)  
**Last Updated**: February 2026  
**Status**: ✅ Active Development  
**Institution**: Chitkara University, Punjab

---

> ⭐ Star this repo if NEXNOTE helped you study smarter!
