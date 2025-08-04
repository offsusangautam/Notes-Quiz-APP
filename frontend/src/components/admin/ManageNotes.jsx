// src/pages/admin/ManageNotes.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get('/api/notes').then((res) => setNotes(res.data));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Notes</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Title</th><th>Subject</th><th>Grade</th><th>Stream</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note._id}>
              <td>{note.title}</td>
              <td>{note.subject}</td>
              <td>{note.grade}</td>
              <td>{note.stream}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
