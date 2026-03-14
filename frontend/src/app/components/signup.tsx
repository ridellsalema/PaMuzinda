import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom"; // using react-router-dom for typical v7
import { Home as HomeIcon, Building2, Wrench, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/axios";

export function Signup() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "";

  const [role, setRole] = useState(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setErrorMsg("Please select a role.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg("");
      const res = await api.post("/auth/register", {
        full_name: fullName,
        email,
        password,
        phone_number: phoneNumber,
        role: role === "General" ? "General" : role
        // For 'General' Users, role could literally be 'General' mapping to the DB enum Valid Roles
      });

      if (res.status === 201) {
        // Now login automatically
        const loginRes = await api.post("/auth/login", { email, password });
        if (loginRes.data.success) {
          login(loginRes.data.data.user, loginRes.data.data.token);
          setSuccess(true);
          setTimeout(() => {
            navigate("/home");
          }, 2000);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Registration failed. Please check your inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-gray-800">Welcome to Muzinda!</h1>
          <p className="text-gray-500 mb-6">
            Your account has been created successfully. Taking you to your dashboard...
          </p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/get-started" className="mb-6 text-gray-500 hover:text-gray-700 inline-flex items-center gap-2">
          ← Back
        </Link>
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
               <HomeIcon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Create account</h1>
            <p className="text-gray-500">to join Muzinda</p>
          </div>

          <form onSubmit={handleSignup}>
            {errorMsg && (
              <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg text-sm text-center">
                {errorMsg}
              </div>
            )}
            
            <div className="mb-4">
               <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors appearance-none"
                  required
                >
                  <option value="" disabled>Select your role</option>
                  <option value="Student">Student (Find Accommodation)</option>
                  <option value="General">General (Find Accommodation)</option>
                  <option value="Landlord">Landlord (List Property)</option>
                  <option value="Handyman">Handyman (Offer Services)</option>
                  <option value="Transport">Transport Provider</option>
                </select>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>
            
            <div className="mb-4">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number (Optional)"
                className="w-full px-4 py-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="mb-6">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min 8 chars)"
                className="w-full px-4 py-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 rounded-xl font-medium shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Signing up..." : "Create account"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/login" className="text-primary hover:underline font-medium">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
