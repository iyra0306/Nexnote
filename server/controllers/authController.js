import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

/**
 * POST /api/auth/signup - Register new user
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, department, semester, rollNumber } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    
    const user = await User.create({ 
      name, 
      email, 
      password,
      role: role || 'student',
      department,
      semester,
      rollNumber
    });
    
    const token = generateToken(user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      semester: user.semester,
      rollNumber: user.rollNumber,
      isVerified: user.isVerified,
      token,
    });
  } catch (error) {
    const msg = isMongoConnectionError(error)
      ? 'Database is not connected. Check server/.env and FIX_MONGODB.md, or use local MongoDB: MONGODB_URI=mongodb://127.0.0.1:27017/nexnote'
      : (error.message || 'Server error');
    res.status(500).json({ message: msg });
  }
};

function isMongoConnectionError(err) {
  const name = err?.name || '';
  const msg = (err?.message || '').toLowerCase();
  return name === 'MongoServerSelectionError' || name === 'MongoNetworkError' || msg.includes('econnrefused') || msg.includes('querysrv');
}

/**
 * POST /api/auth/login - User login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      semester: user.semester,
      rollNumber: user.rollNumber,
      isVerified: user.isVerified,
      bio: user.bio,
      avatar: user.avatar,
      points: user.points,
      badges: user.badges,
      token,
    });
  } catch (error) {
    const msg = isMongoConnectionError(error)
      ? 'Database is not connected. Check server/.env and FIX_MONGODB.md, or use local MongoDB: MONGODB_URI=mongodb://127.0.0.1:27017/nexnote'
      : (error.message || 'Server error');
    res.status(500).json({ message: msg });
  }
};
