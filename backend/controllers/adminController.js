import Quiz from '../models/quiz.js';
import Note from '../models/note.js';
import User from '../models/user.js';
import QuizAttempt from '../models/quizattempt.js';

export const uploadQuiz = async (req, res) => {
  const { grade, stream, subject, chapter, questions } = req.body;

  if (!grade || !stream || !subject || !chapter || !questions || !questions.length) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const quiz = await Quiz.create({
      grade,
      stream,
      subject,
      chapter,
      questions,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: 'Quiz uploaded successfully', quiz });
  } catch (err) {
    console.error('Error uploading quiz:', err);
    res.status(500).json({ message: 'Error uploading quiz', error: err.message });
  }
};

export const uploadNote = async (req, res) => {
  try {
    const { title, content, grade, subject, stream } = req.body;
    if (!title || !content || !grade || !subject || !stream) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const note = new Note({ title, content, grade, subject, stream });
    await note.save();

    res.status(201).json({ message: 'Note saved successfully', note });
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ message: 'Failed to save note', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

export const getAllQuizAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find().populate('user quiz');
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quiz attempts', error: err.message });
  }
};
