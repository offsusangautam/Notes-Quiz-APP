import QuizAttempt from "../models/quiz";

export const createQuizAttempt = async (req, res) => {
  const {
    quizId,
    subject,
    grade,
    stream,
    totalQuestions,
    correctAnswers,
    answers,
  } = req.body;

  if (
    !quizId ||
    !subject ||
    !grade ||
    !stream ||
    totalQuestions == null ||
    correctAnswers == null ||
    !answers
  ) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const attempt = new QuizAttempt({
      userId: req.user._id,
      quizId,
      subject,
      grade,
      stream,
      totalQuestions,
      correctAnswers,
      answers,
    });

    await attempt.save();
    res.status(201).json(attempt);
  } catch {
    res.status(500).json({ message: "Failed to save quiz attempt" });
  }
};

export const getQuizAttempts = async (req, res) => {
  // Filter by userId (for admin: any user, for student: only own attempts)
  // Optional filters: grade, subject, userId

  const filters = {};
  if (req.user.role === "student") {
    filters.userId = req.user._id;
  } else if (req.query.userId) {
    filters.userId = req.query.userId;
  }

  if (req.query.grade) filters.grade = req.query.grade;
  if (req.query.subject) filters.subject = req.query.subject;

  try {
    const attempts = await QuizAttempt.find(filters)
      .populate("userId", "name email")
      .sort({ takenAt: -1 });
    res.json(attempts);
  } catch {
    res.status(500).json({ message: "Failed to fetch quiz attempts" });
  }
};

export const getQuizAttemptById = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.id).populate(
      "userId",
      "name email"
    );
    if (!attempt) return res.status(404).json({ message: "Quiz attempt not found" });

    // If student, allow only own attempt
    if (req.user.role === "student" && attempt.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(attempt);
  } catch {
    res.status(500).json({ message: "Failed to fetch quiz attempt" });
  }
};
