import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueries } from "@tanstack/react-query";
import z from "zod";
import AdminProjectService from "../../services/admin/project";
import { projectUpdateEvent } from "../../lib/custom-events";
import { ClipboardIcon } from "@heroicons/react/20/solid";

export default function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { project, secrets } = useQueries({
    queries: [
      {
        queryKey: ["project", projectId],
        queryFn: () => AdminProjectService.getProjectByKey(projectId || "").then(res => res.result),
        enabled: !!projectId,
      },
      {
        queryKey: ["project", projectId, "secrets"],
        queryFn: () => AdminProjectService.getSecretsByProjectKey(projectId || "").then(res => {
          const resp = res.result || {};
          return Object.entries(resp).map(([key, value]) => ({ key, value }));
        }),
        enabled: !!projectId,
      }
    ],
    combine: (results) => {
      return {
        project: results[0].data,
        secrets: results[1].data,
      };
    },
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
  const secretsForm = useForm({
    defaultValues: {
      secrets: secrets || [],
    },
    validators: {
      onChange: z.object({
        secrets: z.array(z.object({
          key: z.string().min(1, "Key is required"),
          value: z.string().min(1, "Value is required"),
        })),
      }),
    },
    onSubmit: ({ value }) => {
      const secretsObject = value.secrets.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      return AdminProjectService.updateSecrets(projectId || "", secretsObject).then(() => {
        alert("Secrets updated successfully");
      }).catch(err => {
        console.error("Failed to update secrets", err);
        alert("Failed to update secrets");
      });
    },
  })


  useEffect(() => {
    secretsForm.reset();
  }, [projectId, project, secretsForm]);

  if (!project) {
    return <div className="p-8 text-gray-500">Project not found</div>;
  }
  if (!secrets) {
    return <div className="p-8 text-gray-500">Loading secrets...</div>;
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



      <section>
        <div className="mb-6 relative">
          <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">Project Key</h2>
          <div className="relative ">
            <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
              {project.key}
            </pre>
            <button
              className="absolute top-1/2  -translate-y-1/2 right-0 mr-4 text-gray-500 hover:text-gray-700 transition"
              title="Copy Project Key"
              onClick={() => {
                navigator.clipboard.writeText(project.key).then(() => {
                  alert("Project key copied to clipboard");
                }).catch(err => {
                  console.error("Failed to copy project key", err);
                  alert("Failed to copy project key");
                });
              }}
            >
              <ClipboardIcon className="w-4 h-4" />
            </button>
          </div>


        </div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">Secrets</h2>
          <secretsForm.Field name="secrets" mode="array" children={({ pushValue }) => (
            <button className="flex items-center gap-2 px-4 py-2 bg-[#FF9900] text-white rounded hover:bg-[#F90] transition text-xs font-semibold shadow"
              onClick={() => {
                const key = prompt("Enter secret key");
                if (key) {
                  pushValue({ key, value: "" });
                }
              }}
            >
              <PlusIcon className="w-4 h-4" />
              Add Secret
            </button>
          )} />
        </div>
        {/* Enhanced AWS-like secrets list with border instead of shadow */}
        <div className="border-1 border-gray-200 rounded-lg bg-white overflow-hidden">
          <secretsForm.Field name="secrets" mode="array" children={({ removeValue, state }) => (
            <>
              {(state.value).map((_, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 px-4 py-2 relative transition-colors duration-150
                      ${idx !== 10 ? "border-b border-gray-100" : ""}
                      group hover:bg-[#FFF7E6]`}
                >
                  {/* Icon for visual interest */}
                  <span className="text-[#FF9900] mr-1">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="8" cy="10" r="3" />
                      <rect x="12" y="8" width="5" height="4" rx="1" />
                    </svg>
                  </span>
                  <secretsForm.Field
                    name={`secrets[${idx}].key`}
                    children={({ state, name }) => (
                      <input
                        name={name}
                        type="text"
                        value={state.value}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-900 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:bg-white transition"
                        readOnly
                      />
                    )}
                  />
                  <secretsForm.Field
                    name={`secrets[${idx}].value`}
                    children={({ state, name, handleChange, handleBlur }) => (
                      <input
                        name={name}
                        type="text"
                        value={state.value}
                        onChange={e => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        className="flex-1 bg-gray-50 border border-gray-300 rounded px-2 py-1 text-gray-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:bg-white transition"
                      />
                    )}
                  />
                  <button
                    className="text-red-500 hover:text-red-700 px-2 py-1 rounded-full transition opacity-80 group-hover:opacity-100"
                    title="Delete Secret"
                    onClick={() => {
                      removeValue(idx);
                    }}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {state.value.length === 0 && (
                <div className="text-gray-400 text-sm p-4">No secrets found. Click "Add Secret" to create one.</div>
              )}
            </>

          )} />
        </div>
        <div className="flex justify-end mt-8">
          <secretsForm.Subscribe children={({ isValid, isSubmitting, canSubmit }) => (
            <>
              <button onClick={secretsForm.handleSubmit} className="px-6 py-2 bg-[#FF9900] text-white font-semibold rounded hover:bg-[#F90] transition shadow text-sm disabled:opacity-50" disabled={!isValid || isSubmitting || !canSubmit}>
                Save Changes
              </button>
            </>
          )} />
        </div>
      </section>
    </div>
  )
}