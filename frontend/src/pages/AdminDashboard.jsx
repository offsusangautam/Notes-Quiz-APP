import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
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
