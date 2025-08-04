// src/pages/admin/ManageUsers.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/users').then((res) => setUsers(res.data));
    axios.get('/api/admin/attempts').then((res) => setAttempts(res.data));
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Users & Quiz Attempts</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">All Users</h3>
        <ul className="list-disc pl-5">
          {users.map((u) => (
            <li key={u._id}>{u.name} ({u.email}) - {u.grade} {u.stream}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Quiz Attempts</h3>
        <ul className="list-disc pl-5">
          {attempts.map((a) => (
            <li key={a._id}>
              User: {a.userId?.name} | Question: {a.quizId?.question} | Correct: {a.isCorrect ? "✅" : "❌"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
