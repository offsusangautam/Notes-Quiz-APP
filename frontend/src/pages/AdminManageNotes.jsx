import { useEffect, useState } from "react";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AdminManageNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [form, setForm] = useState({
    grade: "10",
    stream: "Science",
    subject: "",
    chapter: "",
    content: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchNotes = () => {
    setLoading(true);
    api
      .get("/notes")
      .then((res) => setNotes(res.data))
      .catch(() => alert("Failed to fetch notes"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const startEdit = (note) => {
    setEditingNote(note);
    setForm({
      grade: note.grade,
      stream: note.stream,
      subject: note.subject,
      chapter: note.chapter,
      content: note.content,
    });
  };

  const resetForm = () => {
    setEditingNote(null);
    setForm({
      grade: "10",
      stream: "Science",
      subject: "",
      chapter: "",
      content: "",
    });
  };

  const handleSave = async () => {
    if (!form.subject || !form.chapter) {
      alert("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      if (editingNote) {
        await api.put(`/notes/${editingNote._id}`, form);
        alert("Note updated");
      } else {
        await api.post("/notes", form);
        alert("Note added");
      }
      resetForm();
      fetchNotes();
    } catch {
      alert("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      alert("Note deleted");
      fetchNotes();
    } catch {
      alert("Failed to delete note");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Notes</h1>

      {/* Note List */}
      <div className="mb-10">
        {loading ? (
          <LoadingSpinner />
        ) : notes.length === 0 ? (
          <p>No notes found.</p>
        ) : (
          <ul className="space-y-4 max-h-64 overflow-auto border p-4 rounded">
            {notes.map((note) => (
              <li
                key={note._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <strong>{note.subject}</strong> - {note.chapter} (Grade {note.grade},{" "}
                  {note.stream})
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => startEdit(note)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Note Form */}
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">
          {editingNote ? "Edit Note" : "Add New Note"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <select
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
          <select
            value={form.stream}
            onChange={(e) => setForm({ ...form, stream: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="Science">Science</option>
            <option value="Management">Management</option>
          </select>
          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Chapter"
            value={form.chapter}
            onChange={(e) => setForm({ ...form, chapter: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <ReactQuill
          theme="snow"
          value={form.content}
          onChange={(content) => setForm({ ...form, content })}
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "list",
            "bullet",
            "link",
            "image",
          ]}
          className="mb-4"
        />
        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : editingNote ? "Update Note" : "Add Note"}
          </button>
          <button
            onClick={resetForm}
            disabled={saving}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
