import { useEffect, useState } from 'react';
import axios from 'axios';

const QuizAttempts = () => {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/user-quiz-attempts', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setAttempts(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Quiz Attempts</h2>
      <ul>
        {attempts.map(a => (
          <li key={a._id} className="border p-2 my-2 rounded">
            User: {a.user?.name} | Q: {a.quiz?.question} | Chosen: {a.selectedAnswer} | Correct: {a.isCorrect ? '✅' : '❌'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizAttempts;
