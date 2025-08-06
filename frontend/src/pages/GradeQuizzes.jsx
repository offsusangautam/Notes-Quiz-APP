import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function GradeQuizzes() {
  const { grade } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const faculty = queryParams.get('faculty');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/quizzes?grade=${grade}${faculty ? `&stream=${faculty}` : ''}`);
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        alert('Failed to fetch quizzes.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [grade]);

  const subjects = [...new Set(quizzes.map(quiz => quiz.subject))];

  const filteredQuizzes = selectedSubject
    ? quizzes.filter(quiz => quiz.subject === selectedSubject)
    : quizzes;

  const displayTitle = `Grade ${grade} ${faculty ? `${faculty} ` : ''}Quizzes`;

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

      {filteredQuizzes.length === 0 ? (
        <p className="text-center text-gray-600">No quizzes available for this grade and subject.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuizzes.map(quiz => (
            <Link
              key={quiz._id}
              to={`/quiz/attempt/${quiz._id}`}
              className="block p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">{quiz.subject} - {quiz.chapter}</h2>
              <p className="text-gray-600">Grade: {quiz.grade}</p>
              <p className="text-gray-600">Stream: {quiz.stream}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}