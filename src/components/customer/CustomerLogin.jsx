// src/components/CustomerLogin.js
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const CustomerLogin = () => {
  const { login, user, role } = useContext(AuthContext);
  //   console.log("login:", login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  console.log("login: user", user, role);
  const [loading, setLoading] = useState(false);

  //   if (user && role == "customer") {
  //     navigate("/customer/dashboard");
  //   }
  // Move navigation logic to useEffect to avoid triggering it during render
  useEffect(() => {
    console.log("useEffect customer login ");
    if (user && role === "customer") {
      navigate("/customer/dashboard");
    }
    // if (user && role !== "customer") {
    //   alert("You are not authorize to login with current role", role);
    //   //   navigate("/customer/dashboard");
    // }
  }, [user, role, navigate]);

  const handleSubmit = async (e) => {
    setLoading(true);
    console.log("customer login submit", email, password);

    e.preventDefault();
    try {
      await login(email, password);
      navigate("/customer/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white-900  flex items-center justify-center">
      <div className="bg-white rounded-2xl border-solid border-2 p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-gray-700">Login</h1>
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

          <div className="flex justify-between items-center w-full">
            <Link className="text-sm text-gray-400 underline cursor-not-allowed pointer-events-none">
              Forgot Password
            </Link>
            <Link
              to="/customer/register"
              className="text-sm text-gray-500 hover:text-gray-900 underline"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;
