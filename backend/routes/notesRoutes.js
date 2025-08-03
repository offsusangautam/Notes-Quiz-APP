import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/notesController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getNotes)
  .post(protect, admin, createNote);

router.route('/:id')
  .get(protect, getNoteById)
  .put(protect, admin, updateNote)
  .delete(protect, admin, deleteNote);

export default router;
