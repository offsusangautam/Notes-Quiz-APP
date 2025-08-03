import { useEffect, useState } from "react";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/quizattempt/user")
      .then((res) => setAttempts(res.data))
      .catch((err) => alert("Failed to load quiz attempts",err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Your Quiz Attempts</h1>
      {attempts.length === 0 ? (
        <p>No quiz attempts yet.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Subject</th>
              <th className="border p-2">Grade</th>
              <th className="border p-2">Stream</th>
              <th className="border p-2">Score</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Review</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt._id} className="text-center">
                <td className="border p-2">{attempt.subject}</td>
                <td className="border p-2">{attempt.grade}</td>
                <td className="border p-2">{attempt.stream}</td>
                <td className="border p-2">
                  {attempt.correctAnswers} / {attempt.totalQuestions}
                </td>
                <td className="border p-2">
                  {new Date(attempt.takenAt).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <Link
                    to={`/quiz/review/${attempt._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
