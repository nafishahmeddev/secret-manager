import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import z from "zod";
import AdminProjectService from "../../../services/admin/project";
import { useQuery } from "@tanstack/react-query";
import EnvUtil from "../../../lib/env";


type SecretsTabProps = {
  project: Project;
  refetch?: () => void; // Optional refetch function for external use
};

export default function SecretsTab({ project }: SecretsTabProps) {
  const { data: secrets } = useQuery({
    queryKey: ["project", project.id, "secrets"],
    queryFn: () => AdminProjectService.getSecretsByProjectId(project.id || "").then(res => {
      const resp = res.result || {};
      return Object.entries(resp).map(([key, value]) => ({ key, value }));
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
      return AdminProjectService.updateSecrets(project.id, secretsObject).then(() => {
        alert("Secrets updated successfully");
      }).catch(err => {
        console.error("Failed to update secrets", err);
        alert("Failed to update secrets");
      });
    },
  })


  useEffect(() => {
    secretsForm.reset();
  }, [project, secretsForm]);
  return (
    <section>

      <secretsForm.Field name="secrets" mode="array" children={({ removeValue, state, pushValue }) => (
        <>
          <div className="border-1 border-gray-200 rounded-lg bg-white overflow-hidden">
            {(state.value).map((_, idx: number) => (
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


          </div>
          <div className="flex justify-end mt-2 gap-4">
            <button
              className="flex items-center gap-2   text-[#FF9900] rounded transition text-xs font-semibold shadow-none hover:underline cursor-pointer"
              onClick={() => {
                const data = prompt("Enter secret key");
                const parsedData = EnvUtil.parseEnvString(data || "");
                if (!parsedData) {
                  alert("Invalid format. Use KEY=VALUE format.");
                  return;
                }
                Object.entries(parsedData).forEach(([key, value]) => {
                  if (state.value.some(secret => secret.key === key)) {
                    return;
                  }
                  pushValue({ key, value });
                });
              }}
            >
              <PlusIcon className="w-4 h-4" />
              Import Secrets from plain text
            </button>
            <button
              className="flex items-center gap-2  text-[#FF9900] rounded transition text-xs font-semibold shadow-none hover:underline cursor-pointer"
              onClick={() => {
                const key = prompt("Enter secret key");
                if(state.value.some(secret => secret.key === key)) {
                  alert("Secret with this key already exists");
                  return;
                }
                if (key) {
                  pushValue({ key, value: "" });
                }
              }}
            >
              <PlusIcon className="w-4 h-4" />
              Add Secret
            </button>


          </div>
        </>
      )} />

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
  );
}
