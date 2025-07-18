import { createBrowserRouter, Link, RouterProvider } from "react-router";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/home.page.tsx";
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
            Component: () => <div className="p-10 py-25 flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-md border border-[#dddfe2]">
              <h1 className="text-2xl font-bold text-gray-900">Welcome to the Secret Manager Admin</h1>
              <p className="text-gray-600 mt-2">Select a project from the sidebar to manage its secrets.</p>
              <p className="text-gray-600 mt-2">Or create a new project to get started.</p>
              <Link to="/projects/create" className="mt-4 inline-block px-6 py-1.5 bg-primary-600 text-white rounded hover:bg-primary-700 transition">
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