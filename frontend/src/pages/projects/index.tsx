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
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-[#232F3E] border-r border-gray-800 flex flex-col py-8  shadow-sm">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5 px-6">
            <h2 className="text-base font-bold text-white tracking-wide uppercase">Projects</h2>
            <Link className="flex items-center gap-1 text-primary-300 hover:text-white transition text-xs font-semibold" to="/projects/create" >
              <PlusIcon className="w-4 h-4" />
              New
            </Link>
          </div>
          <nav>
            {projects && projects.length > 0 && projects.map((project) => (
              <Link
                to={`/projects/${project.id}/details`}
                key={project.id}
                className={`w-full text-left px-4 py-2 transition flex items-center group ${projectId === project.id
                    ? "bg-[#37475A] border-l-4 border-primary-600 text-white font-bold shadow"
                    : "hover:bg-[#304050] text-gray-200 border-l-4 border-transparent"
                  }`}
              >
                <span className="truncate">{project.name}</span>
              </Link>
            ))}

            {(!projects || projects.length === 0) && (
              <div className="text-gray-400 text-sm">No projects found. Create a new project to get started.</div>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto  max-w-[1100px] mx-auto">
        <Outlet />
      </main>
    </div>
  )
}