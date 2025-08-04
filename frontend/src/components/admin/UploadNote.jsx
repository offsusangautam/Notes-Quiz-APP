import { useState } from 'react';
import axios from 'axios';

const UploadNote = () => {
  const [note, setNote] = useState({
    title: '',
    content: '',
    grade: '',
    subject: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/upload-note', note, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Note uploaded!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <form className="p-4 space-y-4" onSubmit={handleSubmit}>
      <input placeholder="Title" value={note.title}
        onChange={e => setNote({ ...note, title: e.target.value })}
        className="input" />
      <textarea placeholder="Content" value={note.content}
        onChange={e => setNote({ ...note, content: e.target.value })}
        className="input" />
      <input placeholder="Grade" value={note.grade}
        onChange={e => setNote({ ...note, grade: e.target.value })}
        className="input" />
      <input placeholder="Subject" value={note.subject}
        onChange={e => setNote({ ...note, subject: e.target.value })}
        className="input" />
      <button className="btn" type="submit">Upload Note</button>
    </form>
  );
};

export default UploadNote;
