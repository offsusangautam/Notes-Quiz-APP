import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        <Link to="/" className="font-bold text-2xl tracking-tight hover:text-indigo-200 transition-colors">
          EduNepal
        </Link>
        <div className="space-x-6">
          {user ? (
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="hover:text-indigo-200 transition-colors font-medium">
                Dashboard
              </Link>
              <Link to="/grades" className="hover:text-indigo-200 transition-colors font-medium">
                Grades
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="hover:text-indigo-200 transition-colors font-medium">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hover:text-indigo-200 transition-colors font-medium">
                Login
              </Link>
              <Link to="/register" className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-300 font-medium">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
