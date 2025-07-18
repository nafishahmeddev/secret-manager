import { Outlet } from "react-router";
import ProjectsSidebar from "./partials/sidebar";

export default function ProjectsPage() {
  return (
    <div className="max-w-5xl w-full mx-auto py-12 px-10  min-h-screen">
      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <ProjectsSidebar />

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}