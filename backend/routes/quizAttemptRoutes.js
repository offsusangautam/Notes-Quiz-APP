import express from 'express';
import {
  submitQuizAttempt,
  getUserQuizAttempts,
  getQuizAttemptById,
  getAllQuizAttempts
} from '../controllers/quizAttemptController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, submitQuizAttempt)
  .get(protect, admin, getAllQuizAttempts);

router.route('/user')
  .get(protect, getUserQuizAttempts);

router.route('/:id')
  .get(protect, getQuizAttemptById);

export default router;
