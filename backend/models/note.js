import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  subject: { type: String, required: true },
  grade: { type: Number, enum: [10, 11, 12], required: true },
  stream: { type: String, enum: ['Science', 'Management'], required: true },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
export default Note;
