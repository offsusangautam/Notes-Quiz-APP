import { useEffect, useState } from "react";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSearchParams, Link } from "react-router-dom";

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const grade = searchParams.get("grade") || "10";
  const defaultStream = grade === "10" ? "" : "Science";
  const stream = searchParams.get("stream") ?? defaultStream;
  const subject = searchParams.get("subject") || "";

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get("/quizzes", {
          params: { grade, stream, subject },
        });
        setQuizzes(res.data);
      } catch (err) {
        alert("Failed to fetch quizzes",err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [grade, stream, subject]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6">
      <h1 className="text-3xl font-bold mb-4">Quizzes</h1>

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

      {quizzes.length === 0 ? (
        <p>No quizzes found for selected filters.</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li
              key={quiz._id}
              className="border p-4 rounded hover:shadow cursor-pointer"
            >
              <Link
                to={`/quiz/attempt/${quiz._id}`}
                className="text-xl font-semibold text-blue-700 hover:underline"
              >
                {quiz.subject} - Chapter: {quiz.chapter}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
