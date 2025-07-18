import { PlusIcon } from "@heroicons/react/20/solid";
import { Link, Outlet, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import AdminProjectService from "../../services/admin/project";
import { useCallback, useEffect } from "react";

export default function ProjectsPage() {
  const { data: projects, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: () => AdminProjectService.getAllProjects().then(res => res.result),
  });
  const { projectId } = useParams();

  const handleProjectUpdate = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    window.addEventListener("projectUpdate", handleProjectUpdate);
    return () => {
      window.removeEventListener("projectUpdate", handleProjectUpdate);
    };
  }, [handleProjectUpdate]);

  return (
    <div className="max-w-5xl w-full mx-auto py-12 px-4  min-h-screen">
      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <aside className="w-64 bg-white border border-gray-200 flex flex-col py-6 px-0 shadow rounded-xl">
          <div className="mb-6 px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-primary-600 tracking-wide">Projects</h2>
              <Link
                className="flex items-center gap-1 text-primary-600 hover:bg-[#e7f3ff] px-2 py-1 rounded transition text-xs font-semibold"
                to="/projects/create"
              >
                <PlusIcon className="w-4 h-4" />
                New
              </Link>
            </div>
            <nav>
              {projects && projects.length > 0 && projects.map((project) => (
                <Link
                  to={`/projects/${project.id}/details`}
                  key={project.id}
                  className={`block px-3 py-2 rounded-lg mb-1 transition font-medium ${
                    projectId === project.id
                      ? "bg-primary-50 text-primary-600 font-bold"
                      : "hover:bg-[#f0f2f5] text-gray-800"
                  }`}
                >
                  <span className="truncate">{project.name}</span>
                </Link>
              ))}
              {(!projects || projects.length === 0) && (
                <div className="text-gray-400 text-sm px-3 py-2">No projects found. Create a new project to get started.</div>
              )}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}