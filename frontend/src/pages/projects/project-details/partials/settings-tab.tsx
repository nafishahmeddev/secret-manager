import { ClipboardIcon } from "@heroicons/react/16/solid";
import AdminProjectService from "@app/services/admin/project";
import { useState } from "react";
import toast from "react-hot-toast";

type SettingsTabProps = {
  project: Project,
  refetch?: () => void;
};

export default function SettingsTab({ project, refetch }: SettingsTabProps) {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const projectUrl = `${baseUrl}/api/v1/rest/secrets/${project.key}`;

  const [isSecretVisible, setIsSecretVisible] = useState(false);

  return (
    <section className="p-8">
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wide">Project Key</h2>
        <div className="relative flex items-center">
          <pre className="flex-1 bg-gray-50 rounded-md px-3 py-2 text-sm text-gray-800 border border-gray-100 text-wrap break-all">{project.key}</pre>
          <button
            className="ml-2 p-2 rounded-full hover:bg-gray-100 transition"
            title="Copy Project Key"
            onClick={() => {
              navigator.clipboard.writeText(project.key).then(() => {
                toast.success("Project key copied to clipboard");
              }).catch(() => {
                toast.error("Failed to copy project key");
              });
            }}
          >
            <ClipboardIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wide">Project URL</h2>
        <div className="relative flex items-center">
          <pre className="flex-1 bg-gray-50 rounded-md px-3 py-2 text-sm text-gray-800 border border-gray-100 text-wrap break-all">
            {baseUrl}/api/v1/rest/secrets/<span className="text-primary-600">{project.key}</span>
          </pre>
          <button
            className="ml-2 p-2 rounded-full hover:bg-gray-100 transition"
            title="Copy Project URL"
            onClick={() => {
              navigator.clipboard.writeText(projectUrl).then(() => {
                toast.success("Project URL copied to clipboard");
              }).catch(() => {
                toast.error("Failed to copy project URL");
              });
            }}
          >
            <ClipboardIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div>

        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wide">IP Whitelist</h2>
          <form
            className="flex items-center gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.elements.namedItem("ipWhitelist") as HTMLInputElement;
              const ip = input.value.trim().split(",").map(ip => ip.trim()).filter(Boolean);
              try {
                await AdminProjectService.updateProject(project.id, { allowedIps: ip });
                toast.success("IP whitelist updated");
                refetch?.();
              } catch {
                toast.error("Failed to update IP whitelist");
              }
            }}
          >
            <input
              type="text"
              name="ipWhitelist"
              className="flex-1 bg-gray-50 rounded-md px-3 py-2 text-sm text-gray-800 border border-gray-100"
              placeholder="Enter IP addresses (comma separated) leave empty to remove"
              defaultValue={project.allowedIps?.join(", ") || ""}
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-semibold hover:bg-primary-700 transition"
            >
              Save
            </button>
          </form>
        </div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex-1">
            API Secret
          </h2>
          <button
            className=" hover:opacity-80 transition mr-11 text-primary-600 text-sm underline cursor-pointer"
            title="Toggle API Secret Visibility"
            onClick={() => setIsSecretVisible(!isSecretVisible)}
          >
            {isSecretVisible ? (
              <span>Hide Secret</span>
            ) : (
              <span>Show Secret</span>
            )}
          </button>
        </div>
        <div className="relative flex items-center mb-3">
          <pre className="flex-1 bg-gray-50 rounded-md px-3 py-2 text-sm text-gray-800 border border-gray-100 break-all text-wrap">{isSecretVisible ? project.apiSecret : project.apiSecret.split("").fill("•").join("")}</pre>
          <button
            className="ml-2 p-2 rounded-full hover:bg-gray-100 transition"
            title="Copy API Secret"
            onClick={() => {
              navigator.clipboard.writeText(project.apiSecret).then(() => {
                toast.success("API secret copied to clipboard");
              }).catch(() => {
                toast.error("Failed to copy API secret");
              });
            }}
          >
            <ClipboardIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <button
          className="inline-flex items-center gap-1 text-primary-600 hover:underline text-xs font-semibold bg-transparent p-0 shadow-none rounded-none focus:outline-none"
          onClick={() => {
            if (confirm("Are you sure you want to create a new API key?")) {
              AdminProjectService.createApiSecret(project.id).then(() => {
                toast.success("API key created successfully");
                refetch?.();
              }).catch(() => {
                toast.error("Failed to create API key");
              });
            }
          }}
          type="button"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Regenerate New Secret
        </button>
      </div>
    </section>
  );
}
