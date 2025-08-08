import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="text-center mb-8 px-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
          Empower Your Learning Journey
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
          Access comprehensive notes and engaging quizzes for Grades 10, 11, and 12 – Science & Management streams.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/login" className="btn-primary text-lg px-8 py-3">
            Get Started
          </Link>
          <Link to="/register" className="btn-secondary text-lg px-8 py-3">
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="card bg-white text-gray-800 p-6 rounded-lg shadow-xl text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-2xl font-bold mb-3">Comprehensive Notes</h3>
          <p>Detailed notes covering all topics for Science and Management streams.</p>
        </div>
        <div className="card bg-white text-gray-800 p-6 rounded-lg shadow-xl text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-2xl font-bold mb-3">Engaging Quizzes</h3>
          <p>Test your knowledge with interactive quizzes designed to boost your understanding.</p>
        </div>
        <div className="card bg-white text-gray-800 p-6 rounded-lg shadow-xl text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-2xl font-bold mb-3">Easy Access</h3>
          <p>All resources are easily accessible anytime, anywhere, on any device.</p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center px-4 animate-fade-in" style={{ animationDelay: '1.0s' }}>
        <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
          Ready to Elevate Your Studies?
        </h2>
        <p className="text-xl mb-8 max-w-xl mx-auto opacity-90">
          Join thousands of students who are already excelling with Nepali Student Portal.
        </p>
        <Link to="/register" className="btn-primary text-lg px-10 py-4">
          Register Now
        </Link>
      </section>
      <p className="mt-10">Developed by Susan Gautam</p>
    </div>
  );
}
