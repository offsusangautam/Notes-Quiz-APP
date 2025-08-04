// src/pages/admin/ManageQuizzes.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    axios.get('/api/quizzes').then((res) => setQuizzes(res.data));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Quizzes</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Question</th><th>Subject</th><th>Grade</th><th>Stream</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz._id}>
              <td>{quiz.question}</td>
              <td>{quiz.subject}</td>
              <td>{quiz.grade}</td>
              <td>{quiz.stream}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
