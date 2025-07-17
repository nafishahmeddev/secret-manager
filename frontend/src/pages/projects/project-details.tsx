import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import AdminProjectService from "../../services/admin/project";
import { projectUpdateEvent } from "../../lib/custom-events";
import SecretsTab from "./partials/secrets-tab.tsx";
import SettingsTab from "./partials/settings-tab.tsx";


export default function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { data: project, refetch } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => AdminProjectService.getProjectById(projectId || "").then(res => res.result),
    enabled: !!projectId,
    initialData: null,
  })

  const deleteMutation = useMutation({
    mutationKey: ["deleteProject", projectId],
    mutationFn: () => AdminProjectService.deleteProject(projectId || "").then(() => {
      alert("Project deleted successfully");
      navigate("/projects");
      window.dispatchEvent(projectUpdateEvent);
    }).catch(err => {
      console.error("Failed to delete project", err);
      alert("Failed to delete project");
    }),
  });



  const [activeTab, setActiveTab] = useState<"secrets" | "settings">("secrets");

  if (!project) {
    return <div className="p-8 text-gray-500">Project not found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{project.name}</h1>
          <p className="text-gray-500 mt-1 text-sm">{project.description}</p>
        </div>
        <div className="flex gap-2">
          <Link className="p-2 rounded hover:bg-gray-100 transition" title="Edit Project" to={`/projects/${project.id}/edit`}>
            <PencilIcon className="w-5 h-5 text-gray-500" />
          </Link>
          <button className="p-2 rounded hover:bg-gray-100 transition" title="Delete Project" onClick={() => {
            if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
              deleteMutation.mutate();
            }
          }}>
            <TrashIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Classic Tabs with bottom border indicator */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`relative px-6 py-2 text-sm font-semibold focus:outline-none transition-colors
            ${activeTab === "secrets"
              ? "text-[#FF9900] border-b-2 border-[#FF9900] bg-white"
              : "text-gray-500 hover:text-[#FF9900]"}
          `}
          style={{ minWidth: 110 }}
          onClick={() => setActiveTab("secrets")}
        >
          Secrets
          {activeTab === "secrets" && (
            <span className="absolute left-0 right-0 -bottom-[2px] h-0.5 bg-[#FF9900] rounded-t"></span>
          )}
        </button>
        <button
          className={`relative px-6 py-2 text-sm font-semibold focus:outline-none transition-colors ml-2
            ${activeTab === "settings"
              ? "text-[#FF9900] border-b-2 border-[#FF9900] bg-white"
              : "text-gray-500 hover:text-[#FF9900]"}
          `}
          style={{ minWidth: 110 }}
          onClick={() => setActiveTab("settings")}
        >
          Settings
          {activeTab === "settings" && (
            <span className="absolute left-0 right-0 -bottom-[2px] h-0.5 bg-[#FF9900] rounded-t"></span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "secrets" && (
        <SecretsTab project={project} refetch={refetch} />
      )}

      {activeTab === "settings" && (
        <SettingsTab project={project} refetch={refetch} />
      )}
    </div>
  );
}
