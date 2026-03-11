import { createBrowserRouter, Outlet } from "react-router";
import { MainLayout } from "./MainLayout";
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

function RootLayout() {
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Landing },
      { path: "onboarding", Component: Onboarding },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "get-started", Component: GetStarted },
      { path: "handyman/onboarding", Component: HandymanOnboarding },
      {
        element: <MainLayout />,
        children: [
          { index: true, Component: Home },
          { path: "/home", Component: Home },
          { path: "/properties", Component: PropertiesPage },
          { path: "/properties/:id", Component: PropertyDetail },
          { path: "/profile", Component: Profile },
          { path: "/applications", Component: Applications },
          { path: "/landlord", Component: LandlordDashboard },
          { path: "/maintenance", Component: Maintenance },
          { path: "/transport", Component: TransportHub },
          { path: "/admin", Component: AdminDashboard },
          { path: "messages", Component: Messages },
        ],
      },
    ],
  },
]);
