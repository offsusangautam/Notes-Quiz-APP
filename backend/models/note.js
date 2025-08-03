import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  grade: { type: Number, enum: [10,11,12], required: true },
  stream: { type: String, enum: ['Science','Management'], required: true },
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  content: { type: String, required: true }, // HTML or markdown
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
export default Note;
