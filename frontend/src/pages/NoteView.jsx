import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function NoteView() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/notes/${id}`)
      .then((res) => setNote(res.data))
      .catch(() => alert("Failed to load note"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!note) return <p>Note not found.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <h1 className="text-3xl font-bold mb-4">
        {note.subject} - Chapter {note.chapter}
      </h1>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
    </div>
  );
}
