import { createBrowserRouter, Outlet } from "react-router-dom";
import { MainLayout } from "./MainLayout";
import { AuthProvider } from "../context/AuthContext";
import { Landing } from "./components/landing";
import { Onboarding } from "./components/onboarding";
import { Signup } from "./components/signup";
import { Login } from "./components/login";
import { GetStarted } from "./components/get-started";
import { Home } from "./components/home";
import { PropertiesPage } from "./components/properties";
import { Profile } from "./components/profile";
import { PropertyDetail } from "./components/property-detail";
import { LandlordDashboard } from "./components/landlord-dashboard";
import { Maintenance } from "./components/maintenance";
import { Applications } from "./components/applications";
import { TransportHub } from "./components/transport";
import { AdminDashboard } from "./components/admin";
import { HandymanOnboarding } from "./components/handyman-onboarding";
import { Messages } from "./components/messages";

// Root wraps everything inside the router so useNavigate works everywhere
function Root() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Landing /> },
      { path: "onboarding", element: <Onboarding /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "get-started", element: <GetStarted /> },
      { path: "handyman/onboarding", element: <HandymanOnboarding /> },
      {
        element: <MainLayout />,
        children: [
          { path: "/home", element: <Home /> },
          { path: "/properties", element: <PropertiesPage /> },
          { path: "/properties/:id", element: <PropertyDetail /> },
          { path: "/profile", element: <Profile /> },
          { path: "/applications", element: <Applications /> },
          { path: "/landlord", element: <LandlordDashboard /> },
          { path: "/maintenance", element: <Maintenance /> },
          { path: "/transport", element: <TransportHub /> },
          { path: "/admin", element: <AdminDashboard /> },
          { path: "messages", element: <Messages /> },
        ],
      },
    ],
  },
]);
