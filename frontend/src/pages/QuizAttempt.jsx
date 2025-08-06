import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuizAndRelated = async () => {
      setLoading(true);
      try {
        const quizRes = await api.get(`/quizzes/${id}`);
        const currentQuiz = quizRes.data;
        setQuiz(currentQuiz);

        const relatedQuizzesRes = await api.get(
          `/quizzes?grade=${currentQuiz.grade}&stream=${currentQuiz.stream}&subject=${currentQuiz.subject}`
        );
        setAllQuizzes(relatedQuizzesRes.data);
      } catch (error) {
        console.error("Failed to load quiz or related quizzes:", error);
        alert("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizAndRelated();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!quiz) return <p>Quiz not found.</p>;

  const currentQuizIndex = allQuizzes.findIndex((q) => q._id === quiz._id);
  const nextQuiz = allQuizzes[currentQuizIndex + 1];

  const handleNextQuiz = () => {
    if (nextQuiz) {
      navigate(`/quiz/attempt/${nextQuiz._id}`);
    }
  };

  const handleChange = (questionIdx, optionIdx) => {
    setAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalQuestions = quiz.questions.length;
    let correctAnswersCount = 0;
    const answerLog = [];

    quiz.questions.forEach((q, i) => {
      const selected = answers[i];
      const isCorrect = selected === q.answer;
      if (isCorrect) correctAnswersCount++;
      answerLog.push({
        question: q.question,
        selectedOption: selected,
        correctOption: q.answer,
        explanation: q.explanation,
      });
    });

    setSubmitting(true);

    try {
      await api.post("/quizattempt", {
        quizId: id,
        subject: quiz.subject,
        grade: quiz.grade,
        stream: quiz.stream,
        totalQuestions,
        correctAnswers: correctAnswersCount,
        answers: answerLog,
      });

      alert(`Quiz submitted! Score: ${correctAnswersCount}/${totalQuestions}`);
      navigate("/dashboard");
    } catch {
      alert("Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <h1 className="text-3xl font-bold mb-6">
        {quiz.subject} - Chapter: {quiz.chapter}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="border p-4 rounded">
            <p className="font-semibold mb-2">
              Q{idx + 1}. {q.question}
            </p>
            <div className="space-y-1">
              {q.options.map((opt, optIdx) => (
                <label
                  key={optIdx}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    value={optIdx}
                    checked={answers[idx] === optIdx}
                    onChange={() => handleChange(idx, optIdx)}
                    required
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
        {nextQuiz && (
          <button
            type="button"
            onClick={handleNextQuiz}
            className="ml-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Next Quiz
          </button>
        )}
      </form>
    </div>
  );
}
