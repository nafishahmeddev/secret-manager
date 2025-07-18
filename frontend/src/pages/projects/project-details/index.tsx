import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import AdminProjectService from "../../../services/admin/project.ts";
import { projectUpdateEvent } from "../../../lib/custom-events.ts";
import SecretsTab from "./partials/secrets-tab.tsx";
import SettingsTab from "./partials/settings-tab.tsx";
import Card from "@app/components/card/index.tsx";

export default function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { data: project, refetch } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => AdminProjectService.getProjectById(projectId || "").then(res => res.result),
    enabled: !!projectId,
    initialData: null,
  });

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
    <Card className="overflow-hidden">

      {/* Facebook-like header */}
      <div className="bg-stone-100/50">
        <div className="relative  rounded-t-xl px-8 pt-8 pb-4 ">
          <div className="flex items-start gap-5 w-full">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 break-words">{project.name}</h1>
              {project.description && (
                <p className="text-gray-600 mt-2 text-base break-words whitespace-pre-line max-h-24 overflow-y-auto">
                  {project.description}
                </p>
              )}
            </div>
            {/* Actions */}
            <div className="flex gap-2">
              <Link
                className="p-2 rounded hover:bg-primary-50 transition"
                title="Edit Project"
                to={`/projects/${project.id}/edit`}
              >
                <PencilIcon className="w-5 h-5 text-primary-600" />
              </Link>
              <button
                className="p-2 rounded hover:bg-red-50 transition"
                title="Delete Project"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this project? This action cannot be undone."
                    )
                  ) {
                    deleteMutation.mutate();
                  }
                }}
              >
                <TrashIcon className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-8">
          <button
            className={`relative px-4 py-2 text-base font-semibold focus:outline-none transition-colors cursor-pointer
                ${activeTab === "secrets"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-600 hover:text-primary-600"}
              `}
            onClick={() => setActiveTab("secrets")}
          >
            Secrets
          </button>
          <button
            className={`relative px-4 py-2 text-base font-semibold focus:outline-none transition-colors ml-2 cursor-pointer
                ${activeTab === "settings"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-600 hover:text-primary-600"}
              `}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </div>
      </div>
      {/* Tab Content */}
      <div className="">
        {activeTab === "secrets" && (
          <SecretsTab project={project} refetch={refetch} />
        )}
        {activeTab === "settings" && (
          <SettingsTab project={project} refetch={refetch} />
        )}
      </div>

    </Card>
  );
}
