import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function GradeNotes() {
  const { grade } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const faculty = queryParams.get('faculty');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/notes?grade=${grade}${faculty ? `&stream=${faculty}` : ''}`);
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
        alert('Failed to fetch notes.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [grade]);

  const subjects = [...new Set(notes.map(note => note.subject))];

  const filteredNotes = selectedSubject
    ? notes.filter(note => note.subject === selectedSubject)
    : notes;

  const displayTitle = `Grade ${grade} ${faculty ? `${faculty} ` : ''}Notes`;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">{displayTitle}</h1>

      <div className="mb-4">
        <label htmlFor="subject-select" className="block text-lg font-medium text-gray-700">Filter by Subject:</label>
        <select
          id="subject-select"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      {filteredNotes.length === 0 ? (
        <p className="text-center text-gray-600">No notes available for this grade and subject.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <Link
              key={note._id}
              to={`/notes/${note._id}`}
              className="block p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
              <p className="text-gray-600">Subject: {note.subject}</p>
              <p className="text-gray-600">Chapter: {note.chapter}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}