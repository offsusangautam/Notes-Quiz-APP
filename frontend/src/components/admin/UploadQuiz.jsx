import { useState } from 'react';
import axios from 'axios';

const UploadQuiz = () => {
  const [form, setForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    grade: '',
    subject: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/upload-quiz', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Quiz uploaded!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <form className="p-4 space-y-4" onSubmit={handleSubmit}>
      <input placeholder="Question" value={form.question}
        onChange={e => setForm({ ...form, question: e.target.value })}
        className="input" />

      {form.options.map((opt, i) => (
        <input key={i} placeholder={`Option ${i + 1}`} value={opt}
          onChange={e => {
            const updated = [...form.options];
            updated[i] = e.target.value;
            setForm({ ...form, options: updated });
          }}
          className="input" />
      ))}

      <input placeholder="Correct Answer"
        value={form.correctAnswer}
        onChange={e => setForm({ ...form, correctAnswer: e.target.value })}
        className="input" />

      <input placeholder="Grade (10/11/12)"
        value={form.grade}
        onChange={e => setForm({ ...form, grade: e.target.value })}
        className="input" />

      <input placeholder="Subject"
        value={form.subject}
        onChange={e => setForm({ ...form, subject: e.target.value })}
        className="input" />

      <button type="submit" className="btn">Upload Quiz</button>
    </form>
  );
};

export default UploadQuiz;
