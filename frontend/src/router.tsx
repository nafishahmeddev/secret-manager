import { createBrowserRouter, Link, RouterProvider } from "react-router";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/projects";
import ProjectDetailsPage from "./pages/projects/project-details";
import ProjectFormPage from "./pages/projects/project-form";

const router = createBrowserRouter([
  {
    Component: AppLayout,
    children: [
      {
        path: "/",
        Component: HomePage,
      },
      {
        path: "projects",
        Component: ProjectsPage,
        children: [
          {
            path:"",
            Component: () => <div className="p-10">
              <h1 className="text-2xl font-bold text-gray-900">Welcome to the Secret Manager Admin</h1>
              <p className="text-gray-600 mt-2">Select a project from the sidebar to manage its secrets.</p>
              <p className="text-gray-600 mt-2">Or create a new project to get started.</p>
              <Link to="/projects/create" className="mt-4 inline-block px-6 py-3 bg-[#FF9900] text-white rounded hover:bg-[#e68a00] transition">
                Create New Project
              </Link>
            </div>,
          },
          {
            path: "create",
            Component: ProjectFormPage,
          },
          {
            path: ":projectId/details",
            Component: ProjectDetailsPage,
          },
          {
            path: ":projectId/edit",
            Component: ProjectFormPage,
          },
        ],
      }
    ],
  },
]);


export function AppRouter() {
  return <RouterProvider router={router} />;
}