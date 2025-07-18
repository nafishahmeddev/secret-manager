import Card from "@app/components/card";
import AdminProjectService from "@app/services/admin/project";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useDebounce } from "@uidotdev/usehooks";

export default function ProjectsSidebar() {
  const [keyword, setKeyword] = useState("");
  const _keyword = useDebounce(keyword, 300);
  const { data: projects, refetch, isFetching } = useQuery({
    queryKey: ["projects", _keyword],
    queryFn: () => AdminProjectService.getAllProjects({ search: _keyword }).then(res => res.result),
  });
  const { projectId } = useParams();

  const handleProjectUpdate = useCallback(() => {
    if (keyword) {
      setKeyword("");
    } else {
      refetch();
    }
  }, [refetch, setKeyword, keyword]);


  useEffect(() => {
    window.addEventListener("projectUpdate", handleProjectUpdate);
    return () => {
      window.removeEventListener("projectUpdate", handleProjectUpdate);
    };
  }, [handleProjectUpdate]);
  return (
    <Card className="w-64  flex flex-col px-0">
      <div className="mb-6">
        <div className="flex items-center justify-between pt-6 pb-4 px-6">
          <h2 className="text-lg font-bold tracking-wide">Projects</h2>
          <Link
            className="flex items-center gap-1 text-primary-600 hover:bg-[#e7f3ff] px-2 py-1 rounded transition text-xs font-semibold"
            to="/projects/create"
          >
            <PlusIcon className="w-4 h-4" />
            New
          </Link>
        </div>
        <div className="px-6">
          <input
            type="text"
            placeholder="Search projects..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        {isFetching ? <div className="text-gray-500 text-sm px-6 py-2">Loading projects...</div> :
          <nav className="py-3">
            {projects && projects.length > 0 && projects.map((project) => (
              <Link
                to={`/projects/${project.id}/details`}
                key={project.id}
                className={`block px-6 py-2 transition font-medium border-x-2 border-transparent border-b overflow-clip text-ellipsis w-full ${projectId === project.id
                  ? "bg-primary-50 text-primary-600 font-bold border-l-primary-600"
                  : "hover:bg-[#f0f2f5] text-gray-800"
                  }`}
              >
                <span className="truncate">{project.name}</span>
              </Link>
            ))}
            {(!projects || projects.length === 0) && (
              <div className="text-gray-400 text-sm px-6 py-2">No projects found. Create a new project to get started.</div>
            )}
          </nav>
        }
      </div>
    </Card>

  );
}
