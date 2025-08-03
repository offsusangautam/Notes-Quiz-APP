import asyncHandler from 'express-async-handler';
import Quiz from '../models/Quiz.js';

// @desc    Get quizzes filtered by query
// @route   GET /api/quizzes?grade=&stream=&subject=
// @access  Private
export const getQuizzes = asyncHandler(async (req, res) => {
  const { grade, stream, subject } = req.query;
  const query = {};
  if (grade) query.grade = grade;
  if (stream) query.stream = stream;
  if (subject) query.subject = subject;

  const quizzes = await Quiz.find(query).sort({ createdAt: -1 });
  res.json(quizzes);
});

// @desc    Get quiz by id
// @route   GET /api/quizzes/:id
// @access  Private
export const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (quiz) res.json(quiz);
  else {
    res.status(404);
    throw new Error('Quiz not found');
  }
});

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private/Admin
export const createQuiz = asyncHandler(async (req, res) => {
  const { grade, stream, subject, chapter, questions } = req.body;

  const quiz = new Quiz({ grade, stream, subject, chapter, questions });
  const createdQuiz = await quiz.save();
  res.status(201).json(createdQuiz);
});

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
export const updateQuiz = asyncHandler(async (req, res) => {
  const { grade, stream, subject, chapter, questions } = req.body;

  const quiz = await Quiz.findById(req.params.id);
  if (quiz) {
    quiz.grade = grade || quiz.grade;
    quiz.stream = stream || quiz.stream;
    quiz.subject = subject || quiz.subject;
    quiz.chapter = chapter || quiz.chapter;
    quiz.questions = questions || quiz.questions;

    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
  } else {
    res.status(404);
    throw new Error('Quiz not found');
  }
});

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
export const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (quiz) {
    await quiz.remove();
    res.json({ message: 'Quiz removed' });
  } else {
    res.status(404);
    throw new Error('Quiz not found');
  }
});
