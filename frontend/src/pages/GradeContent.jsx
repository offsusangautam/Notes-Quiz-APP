import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

export default function GradeContent() {
  const { grade } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const faculty = queryParams.get('faculty');

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Grade {grade} {faculty ? `${faculty} ` : ''}Content</h1>

      {((grade === '11' || grade === '12') && !faculty) ? (
        <p className="text-center text-gray-600">Please select a faculty from the previous page.</p>
      ) : (
        <div className="flex justify-center space-x-4">
          <Link
            to={`/grades/${grade}/notes${faculty ? `?faculty=${faculty}` : ''}`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105"
          >
            Notes
          </Link>
          <Link
            to={`/grades/${grade}/quizzes${faculty ? `?faculty=${faculty}` : ''}`}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105"
          >
            Quizzes
          </Link>
        </div>
      )}

    </div>
  );
}