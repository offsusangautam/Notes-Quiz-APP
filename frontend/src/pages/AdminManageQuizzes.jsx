import { useEffect, useState } from "react";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";

const emptyQuestion = { question: "", options: ["", "", "", ""], answer: 0, explanation: "" };

export default function AdminManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [form, setForm] = useState({
    grade: "10",
    stream: "Science",
    subject: "",
    chapter: "",
    questions: [JSON.parse(JSON.stringify(emptyQuestion))],
  });
  const [saving, setSaving] = useState(false);

  const fetchQuizzes = () => {
    setLoading(true);
    api
      .get("/quizzes")
      .then((res) => setQuizzes(res.data))
      .catch(() => alert("Failed to fetch quizzes"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const startEdit = (quiz) => {
    setEditingQuiz(quiz);
    setForm({
      grade: quiz.grade,
      stream: quiz.stream,
      subject: quiz.subject,
      chapter: quiz.chapter,
      questions: quiz.questions,
    });
  };

  const resetForm = () => {
    setEditingQuiz(null);
    setForm({
      grade: "10",
      stream: "Science",
      subject: "",
      chapter: "",
      questions: [JSON.parse(JSON.stringify(emptyQuestion))],
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...form.questions];
    if (field === "question" || field === "explanation") {
      newQuestions[index][field] = value;
    } else if (field.startsWith("option")) {
      const optionIndex = Number(field.slice(-1));
      newQuestions[index].options[optionIndex] = value;
    } else if (field === "answer") {
      newQuestions[index].answer = Number(value);
    }
    setForm({ ...form, questions: newQuestions });
  };

  const addQuestion = () => {
    setForm({ ...form, questions: [...form.questions, JSON.parse(JSON.stringify(emptyQuestion))] });
  };

  const removeQuestion = (index) => {
    const newQuestions = form.questions.filter((_, i) => i !== index);
    setForm({ ...form, questions: newQuestions });
  };

  const handleSave = async () => {
    if (!form.subject || !form.chapter) {
      alert("Please fill all required fields");
      return;
    }
    if (form.questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    // Validate that all question fields and options are filled
    for (const question of form.questions) {
      if (!question.question.trim()) {
        alert("Please fill in all question texts.");
        return;
      }
      for (let i = 0; i < question.options.length; i++) {
        if (!question.options[i].trim()) {
          alert(`Please fill in all options for question ${form.questions.indexOf(question) + 1}, option ${i + 1}.`);
          return;
        }
      }
    }
    console.log("Form data before saving:", form);
    setSaving(true);
    try {
      if (editingQuiz) {
        await api.put(`/quizzes/${editingQuiz._id}`, form);
        alert("Quiz updated");
      } else {
        await api.post("/quizzes", form);
        alert("Quiz added");
      }
      resetForm();
      fetchQuizzes();
    } catch {
      alert("Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await api.delete(`/quizzes/${id}`);
      alert("Quiz deleted");
      fetchQuizzes();
    } catch {
      alert("Failed to delete quiz");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Quizzes</h1>

      {/* Quiz List with improved styling */}
      <div className="mb-10">
        {loading ? (
          <LoadingSpinner />
        ) : quizzes.length === 0 ? (
          <p>No quizzes found.</p>
        ) : (
          <div className="border rounded-lg p-4 max-h-72 overflow-y-auto bg-gray-50">
            <ul className="space-y-4">
              {quizzes.map((quiz) => (
                <li
                  key={quiz._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <strong>{quiz.subject}</strong> - {quiz.chapter} (Grade {quiz.grade},{" "}
                    {quiz.stream})
                  </div>
                  <div className="space-x-4">
                    <button
                      onClick={() => startEdit(quiz)}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(quiz._id)}
                      className="text-red-600 hover:underline font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main form container */}
      <div className="bg-white p-6 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 border-b pb-4">
          {editingQuiz ? "Edit Quiz" : "Add New Quiz"}
        </h2>

        {/* Section 1: Quiz Details */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Quiz Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Chapter"
              value={form.chapter}
              onChange={(e) => setForm({ ...form, chapter: e.target.value })}
              className="input-field"
            />
            <select
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              className="input-field"
            >
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
            <select
              value={form.stream}
              onChange={(e) => setForm({ ...form, stream: e.target.value })}
              className="input-field"
            >
              <option value="Science">Science</option>
              <option value="Management">Management</option>
            </select>
          </div>
        </div>

        {/* Section 2: Questions */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Questions</h3>
          <div className="space-y-6">
            {form.questions.map((q, idx) => (
              <div key={idx} className="p-4 border rounded-lg bg-gray-50 relative">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-bold text-lg text-gray-800">Question {idx + 1}</p>
                  <button
                    onClick={() => removeQuestion(idx)}
                    className="text-red-600 hover:text-red-800 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={form.questions.length === 1}
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  placeholder="Question text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(idx, "question", e.target.value)}
                  className="input-field w-full mb-3"
                  rows={2}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  {q.options.map((opt, optIdx) => (
                    <input
                      key={optIdx}
                      type="text"
                      placeholder={`Option ${optIdx + 1}`}
                      value={opt}
                      onChange={(e) =>
                        handleQuestionChange(idx, `option${optIdx}`, e.target.value)
                      }
                      className="input-field w-full"
                      required
                    />
                  ))}
                </div>
                <div className="flex items-center mb-3">
                  <label className="mr-3 font-semibold text-gray-700">Correct Answer:</label>
                  <select
                    value={q.answer}
                    onChange={(e) => handleQuestionChange(idx, "answer", e.target.value)}
                    className="input-field w-auto"
                  >
                    {[0, 1, 2, 3].map((optIdx) => (
                      <option key={optIdx} value={optIdx}>
                        Option {optIdx + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  placeholder="Explanation (optional)"
                  value={q.explanation}
                  onChange={(e) => handleQuestionChange(idx, "explanation", e.target.value)}
                  className="input-field w-full"
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Actions */}
        <div className="mt-8 pt-6 border-t flex items-center justify-between">
          <button
            onClick={addQuestion}
            className="btn-secondary"
            type="button"
          >
            Add Another Question
          </button>
          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? "Saving..." : editingQuiz ? "Update Quiz" : "Add Quiz"}
            </button>
            <button
              onClick={resetForm}
              disabled={saving}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
