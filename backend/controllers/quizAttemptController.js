import asyncHandler from 'express-async-handler';
import QuizAttempt from '../models/QuizAttempt.js';

// @desc    Submit quiz attempt
// @route   POST /api/quiz-attempts
// @access  Private
export const submitQuizAttempt = asyncHandler(async (req, res) => {
  const { quizId, subject, grade, stream, totalQuestions, correctAnswers, answers } = req.body;
  const userId = req.user._id;

  const quizAttempt = new QuizAttempt({
    userId, quizId, subject, grade, stream, totalQuestions, correctAnswers, answers
  });

  const createdAttempt = await quizAttempt.save();
  res.status(201).json(createdAttempt);
});

// @desc    Get all attempts by logged-in user
// @route   GET /api/quiz-attempts/user
// @access  Private
export const getUserQuizAttempts = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find({ userId: req.user._id }).sort({ takenAt: -1 });
  res.json(attempts);
});

// @desc    Get quiz attempt by ID
// @route   GET /api/quiz-attempts/:id
// @access  Private
export const getQuizAttemptById = asyncHandler(async (req, res) => {
  const attempt = await QuizAttempt.findById(req.params.id);
  if (attempt) res.json(attempt);
  else {
    res.status(404);
    throw new Error('Quiz attempt not found');
  }
});

// @desc    Get all attempts (admin only)
// @route   GET /api/quiz-attempts
// @access  Private/Admin
export const getAllQuizAttempts = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find().sort({ takenAt: -1 });
  res.json(attempts);
});
