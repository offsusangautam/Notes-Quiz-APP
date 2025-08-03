import Note from '../models/note.js';

export const getNotes = async (req, res) => {
  const { grade, stream, subject, chapter } = req.query;
  const filter = {};
  if (grade) filter.grade = grade;
  if (stream) filter.stream = stream;
  if (subject) filter.subject = subject;
  if (chapter) filter.chapter = chapter;

  try {
    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch {
    res.status(500).json({ message: "Failed to fetch note" });
  }
};

export const createNote = async (req, res) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch {
    res.status(500).json({ message: "Failed to create note" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch {
    res.status(500).json({ message: "Failed to update note" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete note" });
  }
};
