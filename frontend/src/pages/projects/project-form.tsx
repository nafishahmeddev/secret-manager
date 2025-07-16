import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "@tanstack/react-form";
import { useQueries } from "@tanstack/react-query";
import z from "zod";
import AdminProjectService from "../../services/admin/project";
import { projectUpdateEvent } from "../../lib/custom-events";

export default function ProjectFormPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { project } = useQueries({
    queries: [
      {
        queryKey: ["project", projectId],
        queryFn: () => AdminProjectService.getProjectByKey(projectId || "").then(res => res.result),
        enabled: !!projectId,
      },
    ],
    combine: (results) => {
      return {
        project: results[0].data,
      };
    },
  })
  const form = useForm({
    defaultValues: (project || { name: "", description: "" }) as { name: string; description?: string },
    validators: {
      onChange: z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
      }),
    },
    onSubmit: ({ value }) => {
      const req = projectId ? AdminProjectService.updateProject(projectId || "", value) : AdminProjectService.createProject(value);
      return req.then((res) => {
        navigate(`/projects/${res.result.id}/details`);
        alert("Project updated successfully");
        window.dispatchEvent(projectUpdateEvent);
      }).catch(err => {
        console.error("Failed to update project", err);
        alert("Failed to update project");
      });
    },
  })


  useEffect(() => {
    form.reset();
  }, [projectId, project, form]);


  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{projectId ? "Edit Project" : "New Project"}</h1>
          <p className="text-gray-500 mt-1 text-sm">Please fill out the form below to {projectId ? "update" : "create"} a project.</p>
        </div>
      </div>

      <div>
        <form.Field name="name" children={({ state, handleChange }) => (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <input type="text" value={state.value} onChange={e => handleChange(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full" />
            {state.meta.errors && <p className="text-red-500 text-sm mt-1">{state.meta.errors.join(", ")}</p>}
          </div>
        )} />

        <form.Field name="description" children={({ state, handleChange }) => (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea value={state.value} onChange={e => handleChange(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full h-24" />
            {state.meta.errors && <p className="text-red-500 text-sm mt-1">{state.meta.errors.join(", ")}</p>}
          </div>
        )} />
      </div>

      <section>
        <div className="flex justify-end mt-8">
          <form.Subscribe children={({ isValid, isSubmitting, canSubmit }) => (
            <>
              <button
                type="button"
                className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 transition shadow mr-4 text-sm"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button onClick={form.handleSubmit} className="px-6 py-2 bg-[#FF9900] text-white font-semibold rounded hover:bg-[#F90] transition shadow text-sm disabled:opacity-50" disabled={!isValid || isSubmitting || !canSubmit}>
                Save Changes
              </button>
            </>
          )} />
        </div>
      </section>
    </div>
  )
}