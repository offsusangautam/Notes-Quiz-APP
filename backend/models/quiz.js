import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: Number, required: true },
  explanation: { type: String }
});

const quizSchema = new mongoose.Schema({
  grade: { type: Number, enum: [10,11,12], required: true },
  stream: { type: String, enum: ['Science','Management'], required: true },
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  questions: [questionSchema]
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
