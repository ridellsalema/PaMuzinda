import { useState, createContext, useContext } from "react";
import { RouterProvider, useNavigate, useLocation } from "react-router-dom";
import { router } from "./routes";
import { 
  Home as HomeIcon, 
  Search, 
  Wrench, 
  MessageCircle, 
  User, 
  Menu,
  X,
  LogOut,
  Building2,
  Bell,
  Plus,
  FileText,
  Car,
  Users
} from "lucide-react";

import { AuthProvider, useAuth } from "../context/AuthContext";


// Navigation items based on role
const navItems = [
  { icon: HomeIcon, label: "Home", path: "/home", roles: ["student", "general", "landlord", "handyman", "transport"] },
  { icon: HomeIcon, label: "Admin Dashboard", path: "/admin", roles: ["admin"] },
  { icon: Search, label: "Browse", path: "/properties", roles: ["student", "general"] },
  { icon: Building2, label: "My Properties", path: "/properties", roles: ["landlord"] },
  { icon: Building2, label: "Properties", path: "/properties", roles: ["admin"] },
  { icon: FileText, label: "My Applications", path: "/applications", roles: ["student", "general"] },
  { icon: FileText, label: "Applications", path: "/applications", roles: ["landlord"] },
  { icon: Car, label: "Transport", path: "/transport", roles: ["student"] },
  { icon: Car, label: "My Services", path: "/transport/manage", roles: ["transport"] },
  { icon: Wrench, label: "Jobs", path: "/maintenance", roles: ["handyman"] },
  { icon: MessageCircle, label: "Messages", path: "/messages", roles: ["student", "general", "landlord", "handyman", "transport"] },
  { icon: Users, label: "Users", path: "/admin/users", roles: ["admin"] },
  { icon: User, label: "Profile", path: "/profile", roles: ["student", "general", "landlord", "handyman", "transport", "admin"] },
];

export function ResponsiveNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const role = user?.role?.toLowerCase() || "tenant";
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string, label: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(role)
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <img src="/muzinda.png" alt="Muzinda" className="h-8 w-8 rounded-2xl object-cover" />
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src="/muzinda.png" alt="Muzinda" className="h-10 w-10 rounded-2xl object-cover" />
            <span className="text-xl font-bold text-gray-800">Muzinda</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {filteredNavItems.map((item) => (
            <button
              key={item.path + item.label}
              onClick={() => handleNavClick(item.path, item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                item.path === location.pathname || (item.path === "/home" && location.pathname.startsWith("/property"))
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Add Property Button (for landlords) */}
        {role === "landlord" && (
          <div className="p-4">
            <button onClick={() => navigate("/properties/new")} className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl hover:bg-primary/90 transition-colors">
              <Plus className="w-5 h-5" />
              <span>Add Property</span>
            </button>
          </div>
        )}

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{user?.full_name || "Guest"}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role || "Tenant"}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setSidebarOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/muzinda.png" alt="Muzinda" className="h-8 w-8 rounded-2xl object-cover" />
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {filteredNavItems.map((item) => (
                <button
                  key={item.path + item.label}
                  onClick={() => handleNavClick(item.path, item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    item.path === location.pathname || (item.path === "/home" && location.pathname.startsWith("/property"))
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 px-4 py-2 flex items-center justify-around">
        {filteredNavItems.slice(0, 4).map((item) => (
          <button
            key={item.path + item.label}
            onClick={() => handleNavClick(item.path, item.label)}
            className={`flex flex-col items-center gap-1 p-2 ${
              item.path === location.pathname || (item.path === "/home" && location.pathname.startsWith("/property"))
                ? "text-primary"
                : "text-gray-500"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen w-full bg-gray-50 overflow-x-hidden">
      <RouterProvider router={router} />
    </div>
  );
}
