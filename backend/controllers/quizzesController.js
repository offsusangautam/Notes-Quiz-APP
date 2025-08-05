import Quiz from "../models/quiz.js";



export const getQuizzes = async (req, res) => {
  const filters = {};
  const { grade, stream, subject, chapter } = req.query;
  if (grade) filters.grade = grade;
  if (stream) filters.stream = stream;
  if (subject) filters.subject = subject;
  if (chapter) filters.chapter = chapter;

  try {
    const quizzes = await Quiz.find(filters).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch {
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch {
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
};

export const createQuiz = async (req, res) => {
  const { grade, stream, subject, chapter, questions } = req.body;

  if (!grade || !stream || !subject || !chapter || !questions) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    const quiz = new Quiz({ grade, stream, subject, chapter, questions });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Failed to create quiz" });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    Object.assign(quiz, req.body);
    await quiz.save();
    res.json(quiz);
  } catch {
    res.status(500).json({ message: "Failed to update quiz" });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    await quiz.remove();
    res.json({ message: "Quiz deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete quiz" });
  }
};
