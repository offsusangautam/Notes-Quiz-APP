import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Nepali Student Portal</h1>
      <p className="mb-4 text-lg">
        Access notes and quizzes for Grades 10, 11, and 12 - Science & Management streams.
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
