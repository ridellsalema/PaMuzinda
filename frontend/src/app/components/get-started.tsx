import { useNavigate } from "react-router";
import { Home as HomeIcon, Building2, Wrench, ArrowRight } from "lucide-react";

export function GetStarted() {
  const navigate = useNavigate();

  const userTypes = [
    {
      type: "Student",
      icon: HomeIcon,
      title: "Find Accommodation",
      description: "Browse and rent properties",
      color: "bg-blue-500",
    },
    {
      type: "Landlord",
      icon: Building2,
      title: "List Properties",
      description: "Manage your rentals",
      color: "bg-green-500",
    },
    {
      type: "Handyman",
      icon: Wrench,
      title: "Offer Services",
      description: "Connect as a Handyman",
      color: "bg-orange-500",
    },
    {
      type: "Transport",
      icon: Wrench,
      title: "Offer Transport",
      description: "Connect as Transport Provider",
      color: "bg-purple-500",
    }
  ];

  const handleTypeSelect = (role: string) => {
    navigate(`/signup?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <img src="/muzinda.png" alt="Muzinda" className="h-12 w-12 md:h-16 md:w-16 rounded-2xl object-cover" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Welcome to Muzinda</h1>
          <p className="text-gray-500 text-lg">Choose how you want to use the platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userTypes.map(({ type, icon: Icon, title, description, color }) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className="p-6 md:p-8 rounded-2xl md:rounded-3xl border-2 border-gray-200 bg-white hover:border-primary hover:shadow-xl transition-all flex flex-col items-center text-center group"
            >
              <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="font-semibold text-lg text-gray-800 mb-2">{title}</div>
              <div className="text-sm text-gray-500">{description}</div>
              <ArrowRight className="w-5 h-5 text-gray-400 mt-4 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>

        <p className="text-center mt-8 text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
