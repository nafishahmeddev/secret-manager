import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Top Bar */}
      <header className="flex items-center justify-between bg-white shadow-sm px-10 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <img src="https://www.gstatic.com/images/branding/product/1x/admin_48dp.png" alt="Admin" className="w-10 h-10" />
          <span className="text-2xl font-semibold tracking-tight text-gray-900">Secret Manager Admin</span>
        </div>
        {/* Menu buttons */}
        <nav className="flex items-center gap-2">
          <button
            className="px-4 py-2 rounded hover:bg-gray-100 text-gray-700 font-medium transition"
            onClick={() => window.location.pathname = "/"}
          >
            Home
          </button>
          <button
            className="px-4 py-2 rounded hover:bg-gray-100 text-gray-700 font-medium transition"
            onClick={() => window.location.pathname = "/projects"}
          >
            Projects
          </button>
          <img
            src="https://www.gravatar.com/avatar?d=mp"
            alt="User"
            className="w-10 h-10 rounded-full border border-gray-200"
          />
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
