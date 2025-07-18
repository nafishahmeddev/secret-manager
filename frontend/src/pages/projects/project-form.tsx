import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "@tanstack/react-form";
import { useQueries } from "@tanstack/react-query";
import z from "zod";
import AdminProjectService from "../../services/admin/project";
import { projectUpdateEvent } from "../../lib/custom-events";
import Card from "@app/components/card";
import toast from "react-hot-toast";

export default function ProjectFormPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { project } = useQueries({
    queries: [
      {
        queryKey: ["project", projectId],
        queryFn: () => AdminProjectService.getProjectById(projectId || "").then(res => res.result),
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
        toast.success("Project updated successfully");
        window.dispatchEvent(projectUpdateEvent);
      }).catch(() => {
        toast.error("Failed to update project");
      });
    },
  })

  useEffect(() => {
    form.reset();
  }, [projectId, project, form]);

  return (
    <Card className="w-full p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{projectId ? "Edit Project" : "New Project"}</h1>
          <p className="text-gray-600 mt-1 text-base">Please fill out the form below to {projectId ? "update" : "create"} a project.</p>
        </div>
      </div>

      <div>
        <form.Field name="name" children={({ state, handleChange }) => (
          <div className="mb-6">
            <label className="block text-base font-semibold text-gray-800 mb-2">Project Name</label>
            <input
              type="text"
              value={state.value}
              onChange={e => handleChange(e.target.value)}
              className="border border-[#ccd0d5] rounded-lg p-3 w-full ] focus:outline-none focus:ring-2 focus:ring-primary-600 text-gray-900"
              placeholder="Enter project name"
            />
            {state.meta.errors && <p className="text-red-500 text-sm mt-1">{state.meta.errors.join(", ")}</p>}
          </div>
        )} />

        <form.Field name="description" children={({ state, handleChange }) => (
          <div className="mb-6">
            <label className="block text-base font-semibold text-gray-800 mb-2">Description</label>
            <textarea
              value={state.value}
              onChange={e => handleChange(e.target.value)}
              className="border border-[#ccd0d5] rounded-lg p-3 w-full ] focus:outline-none focus:ring-2 focus:ring-primary-600 text-gray-900 h-28"
              placeholder="Enter project description"
            />
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
                className="px-6 py-2 bg-[#e4e6eb] text-gray-800 font-semibold rounded-lg hover:bg-[#d8dadf] transition shadow mr-4 text-base cursor-pointer"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                onClick={form.handleSubmit}
                className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-[#166fe5] transition shadow text-base disabled:opacity-50 cursor-pointer"
                disabled={!isValid || isSubmitting || !canSubmit}
              >
                Save Changes
              </button>
            </>
          )} />
        </div>
      </section>
    </Card>
  )
}