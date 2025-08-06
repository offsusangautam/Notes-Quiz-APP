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

      {/* Quiz List */}
      <div className="mb-10">
        {loading ? (
          <LoadingSpinner />
        ) : quizzes.length === 0 ? (
          <p>No quizzes found.</p>
        ) : (
          <ul className="space-y-4 max-h-64 overflow-auto border p-4 rounded">
            {quizzes.map((quiz) => (
              <li
                key={quiz._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <strong>{quiz.subject}</strong> - {quiz.chapter} (Grade {quiz.grade},{" "}
                  {quiz.stream})
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => startEdit(quiz)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quiz Form */}
      <div className="border p-4 rounded overflow-auto">
        <h2 className="text-xl font-semibold mb-4">
          {editingQuiz ? "Edit Quiz" : "Add New Quiz"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <select
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
          <select
            value={form.stream}
            onChange={(e) => setForm({ ...form, stream: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="Science">Science</option>
            <option value="Management">Management</option>
          </select>
          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Chapter"
            value={form.chapter}
            onChange={(e) => setForm({ ...form, chapter: e.target.value })}
            className="border p-2 rounded"
          />
        </div>

        <h3 className="text-lg font-semibold mb-2">Questions</h3>
        {form.questions.map((q, idx) => (
          <div key={idx} className="mb-6 border p-4 rounded bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">Question {idx + 1}</p>
              <button
                onClick={() => removeQuestion(idx)}
                className="text-red-600 hover:underline"
                disabled={form.questions.length === 1}
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              placeholder="Question text"
              value={q.question}
              onChange={(e) => handleQuestionChange(idx, "question", e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <div className="grid grid-cols-2 gap-2 mb-2">
              {q.options.map((opt, optIdx) => (
                <input
                    type="text"
                    placeholder={`Option ${optIdx + 1}`}
                    value={opt}
                    onChange={(e) =>
                      handleQuestionChange(idx, `option${optIdx}`, e.target.value)
                    }
                    className="border p-2 rounded w-full"
                    required
                  />
              ))}
            </div>
            <div className="mb-2">
              <label className="mr-2 font-semibold">Correct Answer:</label>
              <select
                value={q.answer}
                onChange={(e) => handleQuestionChange(idx, "answer", e.target.value)}
                className="border p-2 rounded"
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
              className="border p-2 rounded w-full"
              rows={2}
            />
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
          type="button"
        >
          Add Question
        </button>
        <div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 mr-4"
          >
            {saving ? "Saving..." : editingQuiz ? "Update Quiz" : "Add Quiz"}
          </button>
          <button
            onClick={resetForm}
            disabled={saving}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
