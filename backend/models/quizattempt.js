import mongoose from 'mongoose';

const answerLogSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedOption: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true }
});

const quizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  subject: { type: String, required: true },
  grade: { type: Number, enum: [10,11,12], required: true },
  stream: { type: String, enum: ['Science','Management'], required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  takenAt: { type: Date, default: Date.now },
  answers: [answerLogSchema]
});

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
export default QuizAttempt;
