import express from 'express';
import {
  createQuizAttempt,
  getQuizAttemptById,
  getAllQuizAttempts,     
  getStudentQuizAttempts,
} from '../controllers/quizAttemptController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

//  Create a quiz attempt (students)
router.post('/', protect, createQuizAttempt);

//  Admin: Get all quiz attempts (with optional filters)
router.get('/', protect, admin, getAllQuizAttempts);

//  Student: Get own attempts
router.get('/user', protect, getStudentQuizAttempts);

//  Get attempt by ID (either student or admin)
router.get('/:id', protect, getQuizAttemptById);

export default router;
