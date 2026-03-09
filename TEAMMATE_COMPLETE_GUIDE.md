# NEXNOTE - Complete Teammate Setup Guide

## 👥 Team Information

**Project**: NEXNOTE - College Notes Management System  
**Team Size**: 4 Members  
**Technology**: MERN Stack (MongoDB, Express, React, Node.js)

---

## 📋 Team Roles & Responsibilities

### Role 1:Backend Developer
**Responsibilities:**
- Backend API development
- Database schema design
- Authentication & authorization
- Server deployment

**Files to Focus On:**
- `server/` folder
- `server/controllers/`
- `server/models/`
- `server/routes/`

---

### Role 2: Project Lead & Frontend Developer & UI/UX
**Responsibilities:**
- Overall project coordination
- React component development
- User interface design
- Responsive design
- Frontend routing
- State management

**Files to Focus On:**
- `client/src/pages/`
- `client/src/components/`
- `client/src/index.css`
- `client/tailwind.config.js`

---

### Role 3: Database Administrator & API Integration
**Responsibilities:**
- MongoDB database management
- API integration with frontend
- Data validation
- File upload handling
- Database optimization

**Files to Focus On:**
- `server/models/`
- `server/config/db.js`
- `client/src/api/api.js`
- `server/middleware/`

---

### Role 4: Testing & Documentation
**Responsibilities:**
- Feature testing
- Bug reporting and fixing
- Documentation updates
- User guide creation
- Deployment assistance

**Files to Focus On:**
- All `.md` documentation files
- Testing all features
- Creating user guides
- README updates

---

## 🚀 Setup Instructions for Teammates

### Prerequisites

Before starting, install these on your computer:

1. **Node.js** (v14 or higher)
   - Download: https://nodejs.org
   - Verify: `node --version`

2. **MongoDB** (Local Database)
   - Download: https://www.mongodb.com/try/download/community
   - Install MongoDB Community Server
   - MongoDB will run as a service automatically

3. **MongoDB Compass** (Database GUI)
   - Download: https://www.mongodb.com/try/download/compass
   - This helps you visualize the database

4. **Git** (Version Control)
   - Download: https://git-scm.com
   - Verify: `git --version`

5. **Code Editor** (VS Code Recommended)
   - Download: https://code.visualstudio.com

---

## 📥 Step 1: Get the Project

### Option A: From GitHub (Recommended)

```bash
# Clone the repository
git clone https://github.com/iyra0317/Nexnote.git

# Navigate to project folder
cd Nexnote
```

### Option B: From Shared Folder

1. Copy the `nexnote` folder to your computer
2. Open terminal/command prompt in that folder

---

## 🔧 Step 2: Install Dependencies

### Install Backend Dependencies:
```bash
cd server
npm install
```

### Install Frontend Dependencies:
```bash
cd ../client
npm install
```

---

## ⚙️ Step 3: Setup Environment Variables

### Create Backend .env File:

1. Go to `server/` folder
2. Create a file named `.env` (exactly this name, no .txt)
3. Add this content:

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/nexnote
JWT_SECRET=iyra
CLIENT_URL=http://localhost:5001
```

### Create Frontend .env File:

1. Go to `client/` folder
2. Create a file named `.env`
3. Add this content:

```env
VITE_API_URL=http://localhost:5001/api
```

---

## 🗄️ Step 4: Setup MongoDB & MongoDB Compass

### Start MongoDB Service:

**Windows:**
- MongoDB should start automatically after installation
- If not, open Services and start "MongoDB Server"

**Mac/Linux:**
```bash
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### Connect with MongoDB Compass:

1. **Open MongoDB Compass**
2. **Connection String**: `mongodb://localhost:27017`
3. **Click "Connect"**
4. You should see the connection established
5. **Create Database**:
   - Click "Create Database"
   - Database Name: `nexnote`
   - Collection Name: `users`
   - Click "Create Database"

### Verify Connection:

- You should see `nexnote` database in the left sidebar
- It will have collections: `users`, `notes`, `announcements`
- These collections will be created automatically when you use the app

---

## 🏗️ Step 5: Build Frontend

```bash
cd client
npm run build
```

This creates a production-ready build in `client/dist/` folder.

---

## ▶️ Step 6: Start the Application

### Start the Server:

```bash
cd server
npm start
```

You should see:
```
✅ Server running on port 5001
✅ Open browser: http://localhost:5001/login
✅ MongoDB Connected: 127.0.0.1
```

### Access the Application:

Open your browser and go to:
```
http://localhost:5001/login
```

---

## 👤 Step 7: Create Test Accounts

### Create Student Account:
1. Go to Signup page
2. Fill in:
   - Name: Your name
   - Email: student@test.com
   - Password: test123
   - Role: **Student**
   - Department: CSE
   - Semester: 5
3. Click Sign up

### Create Teacher Account:
1. Go to Signup page
2. Fill in:
   - Name: Your name
   - Email: teacher@test.com
   - Password: test123
   - Role: **Teacher**
3. Click Sign up

---

## 🔍 Step 8: Verify in MongoDB Compass

1. **Open MongoDB Compass**
2. **Connect** to `mongodb://localhost:27017`
3. **Click** on `nexnote` database
4. **Click** on `users` collection
5. You should see your created users!

### View Data:
- **Users**: All registered users
- **Notes**: Uploaded notes (after uploading)
- **Announcements**: Posted announcements

### Edit Data:
- Click on any document to edit
- Useful for testing and debugging

---

## 🎯 Step 9: Test All Features

### As Student:
- ✅ Login
- ✅ View Notes
- ✅ Filter by Department/Semester
- ✅ Download Notes
- ✅ Add to Favorites
- ✅ Add Comments & Ratings
- ✅ View Announcements
- ✅ Update Profile

### As Teacher:
- ✅ Login
- ✅ Upload Notes (PDF, DOC, DOCX)
- ✅ Mark notes as exam important
- ✅ Add exam tags
- ✅ Create Announcements
- ✅ View Analytics
- ✅ Delete own notes

---

## 🐛 Troubleshooting

### Port Already in Use:
```bash
# Kill process on port 5001
npx kill-port 5001

# Then restart server
npm start
```

### MongoDB Not Connecting:
1. Check if MongoDB service is running
2. Open MongoDB Compass and try connecting
3. Verify connection string: `mongodb://localhost:27017`
4. Restart MongoDB service

### Build Errors:
```bash
# Clear and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Can't See Uploaded Files:
- Check `server/uploads/` folder
- Files are stored with random names
- View in MongoDB Compass: `notes` collection → `fileURL` field

---

## 📁 Project Structure

```
nexnote/
├── client/                 # React Frontend
│   ├── dist/              # Production build
│   ├── public/            # Static files
│   ├── src/
│   │   ├── api/          # API calls
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React Context
│   │   ├── pages/        # All pages (11 pages)
│   │   └── App.jsx       # Main app
│   ├── .env              # Frontend config
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── config/           # Database config
│   ├── controllers/      # API logic
│   ├── middleware/       # Auth & upload
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── uploads/          # Uploaded files
│   ├── .env              # Backend config
│   ├── server.js         # Main server
│   └── package.json
│
└── Documentation/        # Guides
    ├── README.md
    ├── TEAM_SETUP_GUIDE.md
    ├── COLLEGE_PITCH_GUIDE.md
    └── CHECKLIST.md
```

---

## 🔄 Git Workflow for Team

### First Time Setup:
```bash
git clone https://github.com/iyra0317/Nexnote.git
cd Nexnote
```

### Before Starting Work:
```bash
# Get latest changes
git pull origin main
```

### After Making Changes:
```bash
# Check what changed
git status

# Add your changes
git add .

# Commit with message
git commit -m "Your descriptive message"

# Push to GitHub
git push origin main
```

### Best Practices:
- Pull before starting work
- Commit frequently with clear messages
- Don't commit `.env` files (already in .gitignore)
- Test before pushing

---

## 📊 MongoDB Compass Tips

### View Collections:
- **users**: All user accounts
- **notes**: All uploaded notes
- **announcements**: All announcements

### Useful Queries:

**Find all teachers:**
```json
{ "role": "teacher" }
```

**Find CSE notes:**
```json
{ "department": "CSE" }
```

**Find exam important notes:**
```json
{ "isImportantForExam": true }
```

### Export Data:
1. Select collection
2. Click "Export Collection"
3. Choose JSON or CSV
4. Useful for backups

### Import Data:
1. Select collection
2. Click "Add Data" → "Import File"
3. Choose JSON or CSV file

---

## 🎓 Features Overview

### For Students:
- Browse notes by department/semester
- Exam preparation mode
- Download notes offline
- Add favorites
- Rate and comment
- View announcements

### For Teachers:
- Upload notes (PDF, DOC, DOCX)
- Mark exam important content
- Add exam tags and syllabus mapping
- Post announcements
- View analytics
- Manage uploaded notes

### For Admins:
- All teacher features
- User management
- System-wide announcements
- Full analytics access

---

## 📞 Need Help?

**Contact Team Lead**: Iyra  
**Email**: iyra0367.becse24@chitkara.edu.in  
**GitHub**: https://github.com/iyra0317/Nexnote

---

## ✅ Checklist for Each Teammate

- [ ] Node.js installed and verified
- [ ] MongoDB installed and running
- [ ] MongoDB Compass installed and connected
- [ ] Project cloned from GitHub
- [ ] Dependencies installed (client & server)
- [ ] .env files created (client & server)
- [ ] Frontend built successfully
- [ ] Server starts without errors
- [ ] Can access http://localhost:5001/login
- [ ] Created test accounts (student & teacher)
- [ ] Verified data in MongoDB Compass
- [ ] All features tested and working
- [ ] Assigned role understood
- [ ] Git workflow understood

---

## 🎉 You're Ready!

Once all teammates complete this setup:
1. Everyone can work on their assigned roles
2. Use Git to collaborate
3. Test features regularly
4. Use MongoDB Compass to debug
5. Communicate with team lead

**Happy Coding! 🚀**

---

**Last Updated**: 2024  
**Version**: 2.0 (Local MongoDB)  
**Status**: Ready for Team Collaboration
