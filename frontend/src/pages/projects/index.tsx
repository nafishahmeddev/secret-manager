import { Outlet } from "react-router";
import ProjectsSidebar from "./components/sidebar";
import ProjectFormDialog from "./components/form.dialog";

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl w-full mx-auto py-12 px-10  min-h-screen">
      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <ProjectsSidebar />

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <ProjectFormDialog  />
    </div>
  );
}