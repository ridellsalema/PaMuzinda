import { Outlet } from "react-router";
import { ResponsiveNav } from "./App";

/**
 * Wraps authenticated routes with responsive nav and main content area.
 * - Mobile: top bar + bottom nav, content has pt-16 and pb-24 so it doesn't sit under nav.
 * - Desktop: fixed sidebar (w-64), content has md:ml-64 so it doesn't sit under sidebar.
 */
export function MainLayout() {
  return (
    <>
      <ResponsiveNav />
      <main className="min-h-screen w-full bg-gray-50 pt-16 md:pt-8 md:ml-64 pb-24 md:pb-8">
        <Outlet />
      </main>
    </>
  );
}
