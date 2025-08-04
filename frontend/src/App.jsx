import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import Notes from "./pages/Notes";
import NoteView from "./pages/NoteView";
import Quiz from "./pages/Quiz";
import QuizAttempt from "./pages/QuizAttempt";

import AdminDashboard from "./pages/AdminDashboard";
import AdminManageNotes from "./pages/AdminManageNotes";
import AdminManageQuizzes from "./pages/AdminManageQuizzes";
import AdminManageUsers from "./pages/AdminManageUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import QuizReviewPage from "./pages/QuizReviewPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute role="student">
              <Notes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute role="student">
              <NoteView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute role="student">
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/attempt/:id"
          element={
            <ProtectedRoute role="student">
              <QuizAttempt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/review/:id"
          element={
            <ProtectedRoute role="student">
              <QuizReviewPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notes"
          element={
            <ProtectedRoute role="admin">
              <AdminManageNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quizzes"
          element={
            <ProtectedRoute role="admin">
              <AdminManageQuizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminManageUsers />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
