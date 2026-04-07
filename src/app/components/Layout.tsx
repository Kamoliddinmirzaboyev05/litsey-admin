import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-0 lg:ml-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}