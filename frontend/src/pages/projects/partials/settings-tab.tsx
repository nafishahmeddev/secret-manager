import { ClipboardIcon } from "@heroicons/react/16/solid";
import AdminProjectService from "../../../services/admin/project";

type SettingsTabProps = {
  project: Project,
  refetch?: () => void; // Optional refetch function for external use
}
export default function SettingsTab({ project, refetch }: SettingsTabProps) {
  return (
    <section>
      <div className="mb-6">
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


      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">Project URL</h2>
        <div className="relative ">
          <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
            {import.meta.env.VITE_BASE_URL}/api/v1/secrets/<span className="text-primary-600 underline">{project.key}</span>
          </pre>
          <button
            className="absolute top-1/2  -translate-y-1/2 right-0 mr-4 text-gray-500 hover:text-gray-700 transition"
            title="Copy Project URL"
            onClick={() => {
              navigator.clipboard.writeText( `${import.meta.env.VITE_BASE_URL}/api/v1/secrets/${project.key}`).then(() => {
                alert("Project URL copied to clipboard");
              }).catch(err => {
                console.error("Failed to copy project URL", err);
                alert("Failed to copy project URL");
              });
            }}
          >
            <ClipboardIcon className="w-4 h-4" />
          </button>
        </div>
      </div>



      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">Api Secret</h2>
          <button
            className="mt-2 text-[#FF9900] hover:underline bg-transparent px-0 py-0 rounded transition cursor-pointer"
            onClick={() => {
              if (confirm("Are you sure you want to create a new API key?")) {
                AdminProjectService.createApiSecret(project.id).then(() => {
                  alert("API key created successfully");
                  refetch?.(); // Call refetch if provided
                }).catch(err => {
                  console.error("Failed to create API key", err);
                  alert("Failed to create API key");
                });
              }
            }}
          >
            Regenerate Api Secret
          </button>
        </div>

        <div className="relative ">
          <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-sm text-gray-700 text-wrap break-all pr-10">
            {project.apiSecret}
          </pre>
          <button
            className="absolute top-1/2  -translate-y-1/2 right-0 mr-4 text-gray-500 hover:text-gray-700 transition"
            title="Copy Project Key"
            onClick={() => {
              navigator.clipboard.writeText(project.apiSecret).then(() => {
                alert("API secret copied to clipboard");
              }).catch(err => {
                console.error("Failed to copy API secret", err);
                alert("Failed to copy API secret");
              });
            }}
          >
            <ClipboardIcon className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  )
}