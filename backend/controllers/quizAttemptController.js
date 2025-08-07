import QuizAttempt from '../models/quizattempt.js'; // Make sure this model exists and is named correctly

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
      takenAt: new Date(),  // Optional: track time of attempt
    });

    await attempt.save();
    res.status(201).json(attempt);
  } catch (error) {
    console.error('Save Error:', error);
    res.status(500).json({ 
      message: error.message.includes('validation') 
        ? 'Validation failed: ' + error.message
        : 'Failed to save quiz attempt'
    });
  }
};

export const getQuizAttempts = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quiz attempts" });
  }
};

export const getQuizAttemptById = async (req, res) => {
  try {
    console.time("fetchAttempt");
    const attempt = await QuizAttempt.findById(req.params.id)
      .populate("userId", "name")
      .select("correctAnswers totalQuestions userId");

    console.timeEnd("fetchAttempt");

    if (!attempt) return res.status(404).json({ message: "Quiz attempt not found" });

    if (
      req.user.role === "student" &&
      (!attempt.userId || attempt.userId._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(attempt);
  } catch (error) {
    console.error("getQuizAttemptById error:", error);
    res.status(500).json({ message: "Failed to fetch quiz attempt" });
  }
};


export const getAllQuizAttempts = async (req, res) => {
  try {
    const filters = {};
    if (req.query.grade) filters.grade = req.query.grade;
    if (req.query.subject) filters.subject = req.query.subject;
    if (req.query.stream) filters.stream = req.query.stream;
    if (req.query.userId) filters.userId = req.query.userId;

    // Only populate student name
    const attempts = await QuizAttempt.find(filters)
      .populate('userId', 'name') // only get the name field from User
      .select('userId correctAnswers totalQuestions'); // only select needed fields

    // Format response
    const result = attempts.map(attempt => ({
      studentName: attempt.userId?.name || 'Unknown',
      score: `${attempt.correctAnswers}/${attempt.totalQuestions}`,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch quiz attempts' });
  }
};

export const getStudentQuizAttempts = async (req, res) => {
  try {
    console.log('User id:', req.user._id);
    const attempts = await QuizAttempt.find({ userId: req.user._id });
    console.log('Attempts found:', attempts.length);
    res.json(attempts);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ message: 'Failed to load quiz attempts' });
  }
};
