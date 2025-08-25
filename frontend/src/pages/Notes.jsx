import { useEffect, useState } from "react";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSearchParams, Link } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [expanded, setExpanded] = useState({});

  const grade = searchParams.get("grade") || "10";
  const defaultStream = grade === "10" ? "" : "Science";
  const stream = searchParams.get("stream") ?? defaultStream;
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
          onChange={(e) => setSearchParams({ grade: e.target.value, stream: e.target.value === "10" ? "" : stream, subject })}
          className="border p-2 rounded"
        >
          <option value="10">Grade 10</option>
          <option value="11">Grade 11</option>
          <option value="12">Grade 12</option>
        </select>
        {grade !== "10" && (
          <select
            value={stream}
            onChange={(e) => setSearchParams({ grade, stream: e.target.value, subject })}
            className="border p-2 rounded-xl"
          >
            <option value="Science">Science</option>
            <option value="Management">Management</option>
          </select>
        )}
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
          {Object.entries(notes.reduce((acc, n) => {
            acc[n.subject] = acc[n.subject] ? [...acc[n.subject], n] : [n];
            return acc;
          }, {})).map(([subj, subjNotes]) => (
            <li key={subj} className="border rounded">
              <div
                className="p-4 bg-gray-100 cursor-pointer flex justify-between items-center"
                onClick={() => setExpanded((e) => ({ ...e, [subj]: !e[subj] }))}
              >
                <span className="text-xl font-semibold">{subj}</span>
                <span>{expanded[subj] ? "-" : "+"}</span>
              </div>
              {expanded[subj] && (
                <ul className="p-4 space-y-2">
                  {subjNotes.map((note) => (
                    <li key={note._id}>
                      <Link
                        to={`/notes/${note._id}`}
                        className="text-blue-700 hover:underline"
                      >
                        {note.chapter || note.title}
                      </Link>

                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
