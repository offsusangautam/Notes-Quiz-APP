import { useEffect, useState } from "react";
import api from "../api/api"; // your axios instance without timeout
import LoadingSpinner from "../components/LoadingSpinner";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth"

export default function StudentDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [showScore, setShowScore] = useState(location.state?.showScore || false);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Removed the setTimeout that hides the score after 5 seconds
    // if (location.state?.showScore) {
    //   const timer = setTimeout(() => setShowScore(false), 5000); // Auto-hide score after 5 sec
    //   return () => clearTimeout(timer);
    // }
  }, [location.state]);

  useEffect(() => {
    const fetchAttempts = async () => {
      console.log("Fetching user quiz attempts...");
      try {
        // No timeout option here - waits until response
        const response = await api.get("/quizattempt/user");
        console.log("Attempts fetched:", response.data);
        setAttempts(response.data);
      } catch (err) {
        alert("Failed to load quiz attempts");
        console.error("Error fetching quiz attempts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Your Quiz Attempts</h1>
      <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.name}!</h2>
      {/* --- QUICK ACTIONS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link
          to="/notes"
          className="card p-6 bg-blue-100 hover:bg-blue-200 transition-colors duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-blue-800 mb-2">
              Browse Notes
            </h3>
            <p className="text-blue-700">
              Find and review notes for all your subjects.
            </p>
          </Link>
          <Link 
            to="/quiz"
            className="card p-6 bg-green-100 hover:bg-green-200 transition-colors duration-300 transform hover:translate-y-1">
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                Find a New Quiz
              </h3>
              <p className="text-green-700">
                Test your knowledge and prepare for exams.
              </p>
            </Link>
      </div>
      {/* --- END OF QUICK ACTIONS --- */}

      <h3 className="text-2xl font-bold mb-4">Your Recent Quiz Attempts</h3>
      {attempts.length === 0 ? (
        <div className="text-center p-6 border rounded-lg bg-gray-50">
          <p className="text-gray-600">You haven't attempted any quizzes yet.</p>
          <Link to="/quiz" className="text-blue-600 hover:underline font-semibold mt-2 inline-block">
            Attempt your first quiz!
          </Link>
        </div>
      ) : (
        <table className="w-full border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Subject</th>
              <th className="border p-2">Grade</th>
              <th className="border p-2">Stream</th>
              <th className="border p-2">Score</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Review</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt._id} className="text-center">
                <td className="border p-2">{attempt.subject}</td>
                <td className="border p-2">{attempt.grade}</td>
                <td className="border p-2">{attempt.stream}</td>
                <td className="border p-2">
                  {attempt.correctAnswers} / {attempt.totalQuestions}
                </td>
                <td className="border p-2">
                  {new Date(attempt.takenAt).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <Link
                    to={`/quiz/review/${attempt._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showScore && location.state?.scoreData && (
        <div className="bg-green-100 p-4 rounded mb-4 mt-6">
          <h3 className="font-bold">
            Quiz Results: {location.state.scoreData.correctAnswers}/
            {location.state.scoreData.totalQuestions}
          </h3>
        </div>
      )}
    </div>
  );
}
