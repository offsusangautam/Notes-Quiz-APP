import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function GradeSelection() {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const navigate = useNavigate();

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    if (grade === 10) {
      navigate(`/grades/${grade}`);
    }
  };

  const handleFacultySelect = (faculty) => {
    navigate(`/grades/${selectedGrade}?faculty=${faculty}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Select Your Grade</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => handleGradeSelect(10)}
          className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-blue-100 text-center font-semibold text-xl text-blue-800 hover:bg-blue-200"
        >
          Grade 10
        </button>
        <button
          onClick={() => handleGradeSelect(11)}
          className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-green-100 text-center font-semibold text-xl text-green-800 hover:bg-green-200"
        >
          Grade 11
        </button>
        <button
          onClick={() => handleGradeSelect(12)}
          className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-purple-100 text-center font-semibold text-xl text-purple-800 hover:bg-purple-200"
        >
          Grade 12
        </button>
      </div>

      {(selectedGrade === 11 || selectedGrade === 12) && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Select Faculty for Grade {selectedGrade}</h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleFacultySelect('science')}
              className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-red-100 text-center font-semibold text-lg text-red-800 hover:bg-red-200"
            >
              Science
            </button>
            <button
              onClick={() => handleFacultySelect('management')}
              className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-yellow-100 text-center font-semibold text-lg text-yellow-800 hover:bg-yellow-200"
            >
              Management
            </button>
          </div>
        </div>
      )}
    </div>
  );
}