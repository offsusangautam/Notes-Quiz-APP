import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      login(res.data.token, res.data);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border border-gray-200">
        <div>
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">Welcome Back</h1>
          <p className="text-center text-gray-600 text-lg">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
          <div>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email Address"
              className="input-field"
              required
            />
          </div>
          <div>
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Password"
              className="input-field"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Sign In
          </button>
        </form>
        <p className="mt-8 text-center text-gray-600 text-md">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
