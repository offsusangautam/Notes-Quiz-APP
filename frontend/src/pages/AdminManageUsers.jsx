import { useEffect, useState } from "react";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [attempts, setAttempts] = useState([]);
 
  const [loadingAttempts, setLoadingAttempts] = useState(true);
  const [filter, setFilter] = useState({ grade: "", subject: "", userId: "" });

  useEffect(() => {
    api
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => alert("Failed to load users"))
 
  }, []);

  const fetchAttempts = () => {
    setLoadingAttempts(true);
    api
      .get("/quiz-attempts", { params: filter })
      .then((res) => setAttempts(res.data))
      .catch(() => alert("Failed to load attempts"))
      .finally(() => setLoadingAttempts(false));
  };

  useEffect(() => {
    fetchAttempts();
  }, [filter]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users & Quiz Attempts</h1>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <select
          value={filter.grade}
          onChange={(e) => setFilter({ ...filter, grade: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Grades</option>
          <option value="10">Grade 10</option>
          <option value="11">Grade 11</option>
          <option value="12">Grade 12</option>
        </select>
        <input
          type="text"
          placeholder="Subject"
          value={filter.subject}
          onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={filter.userId}
          onChange={(e) => setFilter({ ...filter, userId: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Users</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
        <button
          onClick={fetchAttempts}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filter
        </button>
      </div>

      {/* Attempts List */}
      {loadingAttempts ? (
        <LoadingSpinner />
      ) : attempts.length === 0 ? (
        <p>No quiz attempts found.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">User</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Grade</th>
              <th className="border p-2">Stream</th>
              <th className="border p-2">Score</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt._id}>
                <td className="border p-2">{attempt.user?.name || "Unknown"}</td>
                <td className="border p-2">{attempt.subject}</td>
                <td className="border p-2">{attempt.grade}</td>
                <td className="border p-2">{attempt.stream}</td>
                <td className="border p-2">
                  {attempt.correctAnswers} / {attempt.totalQuestions}
                </td>
                <td className="border p-2">
                  {new Date(attempt.takenAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
