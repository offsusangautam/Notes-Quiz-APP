import { useEffect, useState } from "react";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSearchParams, Link } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const grade = searchParams.get("grade") || "10";
  const stream = searchParams.get("stream") || "Science";
  const subject = searchParams.get("subject") || "";

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes", {
          params: { grade, stream, subject },
        });
        setNotes(res.data);
      } catch (err) {
        alert("Failed to fetch notes",err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [grade, stream, subject]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6">
      <h1 className="text-3xl font-bold mb-4">Notes</h1>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <select
          value={grade}
          onChange={(e) => setSearchParams({ grade: e.target.value, stream, subject })}
          className="border p-2 rounded"
        >
          <option value="10">Grade 10</option>
          <option value="11">Grade 11</option>
          <option value="12">Grade 12</option>
        </select>
        <select
          value={stream}
          onChange={(e) => setSearchParams({ grade, stream: e.target.value, subject })}
          className="border p-2 rounded"
        >
          <option value="Science">Science</option>
          <option value="Management">Management</option>
        </select>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSearchParams({ grade, stream, subject: e.target.value })}
          className="border p-2 rounded flex-grow"
        />
      </div>

      {notes.length === 0 ? (
        <p>No notes found for selected filters.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note._id}
              className="border p-4 rounded hover:shadow cursor-pointer"
            >
              <Link
                to={`/notes/${note._id}`}
                className="text-xl font-semibold text-blue-700 hover:underline"
              >
                {note.subject} - Chapter: {note.chapter}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
