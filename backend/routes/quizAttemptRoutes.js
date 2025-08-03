import express from 'express';
import {
  createQuizAttempt,
  getQuizAttempts,
  getQuizAttemptById,
} from '../controllers/quizAttemptController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createQuizAttempt)
  .get(protect, admin, getQuizAttempts);

router.route('/user')
  .get(protect, getQuizAttempts); // students get their own attempts here

router.route('/:id')
  .get(protect, getQuizAttemptById);

export default router;
