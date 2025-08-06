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

  const handleChange = (questionId, selectedIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedIndex,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const unanswered = quiz.questions.filter(
      (q) => answers[q._id] === undefined
    );
    if (unanswered.length > 0) {
      alert(`Please answer all questions (${unanswered.length} unanswered)`);
      return;
    }

    const totalQuestions = quiz.questions.length;
    let correctAnswersCount = 0;

    const answerLog = quiz.questions.map((q) => {
      const selected = answers[q._id];
      const isCorrect = selected === q.answer;
      if (isCorrect) correctAnswersCount++;

      return {
        questionId: q._id,
        selectedOption: selected,
        isCorrect,
      };
    });

    const payload = {
      quizId: id,
      subject: quiz.subject,
      grade: quiz.grade,
      stream: quiz.stream,
      totalQuestions,
      correctAnswers: correctAnswersCount,
      answers: answerLog,
    };

    console.log("Submission Payload:", payload);

    setSubmitting(true);

    try {
      await api.post("/quiz-attempts", payload);
      alert(`Quiz submitted! Score: ${correctAnswersCount}/${totalQuestions}`);
      navigate("/dashboard", {
        state: {
          showScore: true,
          scoreData: {
            correctAnswers: correctAnswersCount,
            totalQuestions,
          },
        },
      });
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message);
      alert(
        `Submission failed: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          {quiz.subject} - Chapter: {quiz.chapter}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {quiz.questions.map((q, idx) => (
            <div key={q._id} className="card p-6 hover:border-indigo-200">
              <p className="text-xl font-semibold mb-4 text-gray-800">
                Q{idx + 1}. {q.question}
              </p>
              <div className="space-y-3">
                {q.options.map((opt, optIdx) => (
                  <label
                    key={optIdx}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${q._id}`}
                      value={optIdx}
                      checked={answers[q._id] === optIdx}
                      onChange={() => handleChange(q._id, optIdx)}
                      required
                      className="form-radio h-5 w-5 text-indigo-600"
                    />
                    <span className="ml-3 text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="flex space-x-4 mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
            {nextQuiz && (
              <button
                type="button"
                onClick={handleNextQuiz}
                className="btn-secondary flex-1"
              >
                Next Quiz
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
