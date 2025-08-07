import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminQuizAttempts = () => {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/quiz-attempts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttempts(response.data);
      } catch (error) {
        console.error('Error fetching attempts:', error);
      }
    };

    fetchAttempts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Student Quiz Scores</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Student Name</th>
            <th className="border p-2 text-left">Score</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((a, idx) => (
            <tr key={idx}>
              <td className="border p-2">{a.studentName}</td>
              <td className="border p-2">{a.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminQuizAttempts;
