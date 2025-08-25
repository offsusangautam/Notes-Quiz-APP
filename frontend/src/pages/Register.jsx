import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import useAuth from "../hooks/useAuth";

export default function Register() {
  const { register, handleSubmit, watch } = useForm();
  const selectedGrade = watch("grade");
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      if (data.grade === "10") {
        delete data.stream;
      }
      const res = await api.post("/auth/register", data);
      login(res.data.token, res.data);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border border-gray-200">
        <div>
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">Create Your Account</h1>
          <p className="text-center text-gray-600 text-lg">Join us to start your learning journey</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
          <input
            {...register("name", { required: true })}
            type="text"
            placeholder="Full Name"
            className="input-field"
            required
          />
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="Email Address"
            className="input-field"
            required
          />
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Password"
            className="input-field"
            required
          />
          <select
            {...register("grade", { required: true })}
            className="input-field"
            required
          >
            <option value="">Select Grade</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
          {selectedGrade && selectedGrade !== "10" && (
            <select
              {...register("stream", { required: true })}
              className="input-field"
            >
              <option value="">Select Stream</option>
              <option value="Science">Science</option>
              <option value="Management">Management</option>
            </select>
          )}
          <button type="submit" className="btn-primary w-full">
            Register
          </button>
        </form>
        <p className="mt-8 text-center text-gray-600 text-md">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
