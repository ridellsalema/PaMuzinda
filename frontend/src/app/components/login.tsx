import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Home as HomeIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/axios";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrorMsg("");
      const res = await api.post("/auth/login", { email, password });
      
      if (res.data.success) {
        const userData = res.data.data.user;
        const tokenData = res.data.data.token;
        login(userData, tokenData);
        
        // Redirect based on role
        if (userData.role === "Student" || userData.role === "General") {
          navigate("/properties");
        } else if (userData.role === "Handyman") {
          navigate("/maintenance");
        } else if (userData.role === "Transport") {
          navigate("/transport/manage");
        } else if (userData.role === "Admin") {
          navigate("/admin");
        } else {
          navigate("/home"); // default landlord or general dashboard anchor
        }
      }
    } catch (err: any) {
      if (err.response?.status === 429) {
        setErrorMsg("Too many attempts. Please wait and try again.");
      } else {
        setErrorMsg("Incorrect email or password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 text-gray-500 hover:text-gray-700 flex items-center gap-2">
          ← Back to home
        </Link>
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
               <HomeIcon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-500">to continue to Muzinda</p>
          </div>

          <form onSubmit={handleLogin}>
            {errorMsg && (
              <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg text-sm text-center">
                {errorMsg}
              </div>
            )}
            
             <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full px-4 py-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            <div className="mb-6">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="mb-6 text-right">
               <button type="button" className="text-primary hover:underline font-medium text-sm">
                 Forgot password?
               </button>
             </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 rounded-xl font-medium shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/get-started" className="text-primary hover:underline font-medium">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
