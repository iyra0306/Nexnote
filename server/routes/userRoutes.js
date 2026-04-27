import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getProfile, updateProfile, changePassword, toggleFavorite, getFavorites,
} from '../controllers/userController.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/favorites/:noteId', toggleFavorite);
router.get('/favorites', getFavorites);

export default router;
