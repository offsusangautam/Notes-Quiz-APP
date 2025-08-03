import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function QuizReviewPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/quizattempt/${id}`)
      .then((res) => setAttempt(res.data))
      .catch(() => alert("Failed to load quiz attempt"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!attempt) return <p>Quiz attempt not found.</p>;

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Review: {attempt.subject} - Attempt on{" "}
        {new Date(attempt.takenAt).toLocaleDateString()}
      </h1>
      <p className="mb-4 font-semibold">
        Score: {attempt.correctAnswers} / {attempt.totalQuestions}
      </p>
      <div className="space-y-6">
        {attempt.answers.map((ans, idx) => {
          const isCorrect = ans.selectedOption === ans.correctOption;
          return (
            <div
              key={idx}
              className={`p-4 border rounded ${
                isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
              }`}
            >
              <p className="font-semibold mb-1">
                Q{idx + 1}. {ans.question}
              </p>
              <p>
                Your answer:{" "}
                <span className={isCorrect ? "text-green-700" : "text-red-700"}>
                  {ans.selectedOption !== null
                    ? ans.selectedOption !== undefined
                      ? ans.selectedOption === 0
                        ? "Option 0"
                        : `Option ${ans.selectedOption + 1}`
                      : "No answer"
                    : "No answer"}
                </span>
              </p>
              {!isCorrect && (
                <p className="text-green-700">
                  Correct answer: Option {ans.correctOption + 1}
                </p>
              )}
              {ans.explanation && (
                <p className="mt-2 italic text-gray-700">Explanation: {ans.explanation}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
