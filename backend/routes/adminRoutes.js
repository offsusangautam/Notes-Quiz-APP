import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import {
  uploadQuiz,
  uploadNote,
  getAllUsers,
  getAllQuizAttempts
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/upload-quiz', protect, admin, uploadQuiz);
router.post('/upload-note', protect, admin, uploadNote);
router.get('/users', protect, admin, getAllUsers);
router.get('/attempts', protect, admin, getAllQuizAttempts);

export default router;
