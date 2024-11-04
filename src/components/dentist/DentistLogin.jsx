import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DentistLogin = () => {
  const { login, user, role } = useContext(AuthContext);
  console.log("dentist login: user", user, role);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && role === "dentist") {
      navigate("/dentist/dashboard");
    }
  }, [user, role, navigate]);

  const handleSubmit = async (e) => {
    setLoading;
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dentist/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white-900  flex items-center justify-center">
      <div className="bg-white rounded-2xl border-solid border-2  p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-gray-500">LOGO</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className="text-center">
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900"
              style={{ pointerEvents: "none", textDecoration: "underline" }}
            >
              Forgot password
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DentistLogin;
