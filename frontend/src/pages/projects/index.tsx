import { PlusIcon } from "@heroicons/react/20/solid";
import { Link, Outlet, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import AdminProjectService from "../../services/admin/project";
import { useCallback, useEffect } from "react";
import Card from "@app/components/card";

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
    <div className="max-w-5xl w-full mx-auto py-12 px-10  min-h-screen">
      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <Card className="w-64  flex flex-col px-0">
          <div className="mb-6">
            <div className="flex items-center justify-between pt-6 pb-4 px-6 border-b border-gray-200">
              <h2 className="text-lg font-bold tracking-wide">Projects</h2>
              <Link
                className="flex items-center gap-1 text-primary-600 hover:bg-[#e7f3ff] px-2 py-1 rounded transition text-xs font-semibold"
                to="/projects/create"
              >
                <PlusIcon className="w-4 h-4" />
                New
              </Link>
            </div>
            <nav className=" py-3">
              {projects && projects.length > 0 && projects.map((project) => (
                <Link
                  to={`/projects/${project.id}/details`}
                  key={project.id}
                  className={`block px-6 py-2 transition font-medium border-x-2 border-transparent border-b overflow-clip text-ellipsis w-full ${
                    projectId === project.id
                      ? "bg-primary-50 text-primary-600 font-bold border-l-primary-600"
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
        </Card>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}