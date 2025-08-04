import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import {
  uploadQuiz,
  uploadNote,
  getAllUsers,
  getAllQuizAttempts
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/upload-quiz', protect, isAdmin, uploadQuiz);
router.post('/upload-note', protect, isAdmin, uploadNote);
router.get('/users', protect, isAdmin, getAllUsers);
router.get('/attempts', getAllAttempts);
router.post('/admin/notes', protect, admin, uploadNote);

export default router;
