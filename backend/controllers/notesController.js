import asyncHandler from 'express-async-handler';
import Note from '../models/Note.js';

// @desc    Get notes filtered by query
// @route   GET /api/notes?grade=&stream=&subject=
// @access  Private
export const getNotes = asyncHandler(async (req, res) => {
  const { grade, stream, subject } = req.query;
  const query = {};
  if (grade) query.grade = grade;
  if (stream) query.stream = stream;
  if (subject) query.subject = subject;

  const notes = await Note.find(query).sort({ createdAt: -1 });
  res.json(notes);
});

// @desc    Get note by id
// @route   GET /api/notes/:id
// @access  Private
export const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (note) res.json(note);
  else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Create note
// @route   POST /api/notes
// @access  Private/Admin
export const createNote = asyncHandler(async (req, res) => {
  const { grade, stream, subject, chapter, content } = req.body;

  const note = new Note({ grade, stream, subject, chapter, content });
  const createdNote = await note.save();
  res.status(201).json(createdNote);
});

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private/Admin
export const updateNote = asyncHandler(async (req, res) => {
  const { grade, stream, subject, chapter, content } = req.body;

  const note = await Note.findById(req.params.id);
  if (note) {
    note.grade = grade || note.grade;
    note.stream = stream || note.stream;
    note.subject = subject || note.subject;
    note.chapter = chapter || note.chapter;
    note.content = content || note.content;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private/Admin
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (note) {
    await note.remove();
    res.json({ message: 'Note removed' });
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});
