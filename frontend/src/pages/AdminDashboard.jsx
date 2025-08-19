import { Link } from "react-router-dom";
import { useEffect, useState } from "react"; 
import api from "../api/api";

// A small component for our statistics cards
const StatCard = ({ title, value, bgColor }) => (
  <div className={`card p-6 ${bgColor} text-white`}>
    <h3 className="text-4xl font-bold">{value}</h3>
    <p className="text-lg">{title}</p>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, notes: 0, quizzes: 0});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersRes = await api.get("/users");
        const notesRes = await api.get("/notes");
        const quizzesRes = await api.get("/quizzes");

        setStats({
          users: usersRes.data.length,
          notes: notesRes.data.length,
          quizzes: quizzesRes.data.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* --- STATS CARDS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Users" value={loading ? "..." : stats.users} bgColor="bg-blue-500" />
        <StatCard title="Total Notes" value={loading ? "..." : stats.notes} bgColor="bg-green-500" />
        <StatCard title="Total Quizzes" value={loading ? "..." : stats.quizzes} bgColor="bg-indigo-500" />
      </div>
      {/* --- END OF STATS CARDS --- */}
      
      <div className="mb-8 p-4 bg-gray-50 rounded border">
        <h2 className="text-xl font-semibold mb-2">Admin Features</h2>
        <div className="text-gray-700">
          <p className="mb-2"><strong>Admin Login</strong> - Admin can log in securely and access admin-only routes.</p>
          <p className="mb-2"><strong>Manage Notes</strong> - Admin can Add, Edit, and Delete Notes. Use a rich text editor (like React Quill) for adding formatted content. Upload or embed images/diagrams if needed.</p>
          <p className="mb-2"><strong>Manage Quizzes</strong> - Admin can Add, Edit, Delete Quizzes. Each quiz entry includes: Grade, Stream, Subject, Chapter List of MCQs with correct answer and explanation.</p>
          <p className="mb-2"><strong>Manage Users & Attempts</strong> - View list of all registered students. Filter quiz attempts by grade, subject, or user.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/notes"
          className="p-6 border rounded hover:shadow bg-blue-100 text-center font-semibold"
        >
          Manage Notes
        </Link>
        <Link
          to="/admin/quizzes"
          className="p-6 border rounded hover:shadow bg-green-100 text-center font-semibold"
        >
          Manage Quizzes
        </Link>
        <Link
          to="/admin/users"
          className="p-6 border rounded hover:shadow bg-yellow-100 text-center font-semibold"
        >
          Manage Users & Attempts
        </Link>
      </div>
    </div>
  );
}

