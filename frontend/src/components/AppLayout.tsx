import AuthApi from "@app/services/auth";
import { ChevronDownIcon, FolderIcon, HomeIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Outlet, useLocation, useNavigate } from "react-router";

const MenuButton = ({ label, to, icon }: { label: string; to: string; icon: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <button
      className={`px-4 py-4 border-y-2 border-t-transparent cursor-pointer  text-gray-700 font-medium transition flex items-center gap-2 ${isActive ? 'border-b-primary-600' : 'hover:opacity-80 border-b-transparent'}`}
      onClick={() => navigate(to)}
    >
      {icon}
      {label}
    </button>
  );
}
export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col ">
      {/* Top Bar */}
      <header className="flex items-center justify-between bg-white shadow-sm px-10 border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-semibold tracking-tight text-gray-900">Secret Manager</span>
        </div>
        {/* Menu buttons */}
        <nav className="flex items-center flex-1 justify-center">
          <MenuButton label="Home" to="/" icon={<HomeIcon className="h-5 w-5" />} />
          <MenuButton label="Projects" to="/projects" icon={<FolderIcon className="h-5 w-5" />} />

        </nav>
        <div className="relative group">
          <button
            className="flex items-center gap-2 px-3 py-4 group-hover:bg-gray-100 transition focus:outline-none border-y-2 border-y-transparent text-gray-700 font-medium"
            id="user-menu-button"
            aria-haspopup="true"
            aria-expanded="false"
          // TODO: Add dropdown toggle logic
          >
            {/* User Icon from Heroicons */}
            <UserCircleIcon className="h-6 w-6 text-gray-700" />
            {/* Chevron Down Icon */}
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </button>
          <div className=" flex flex-col gap-4 collapse group-hover:visible  absolute right-0 top-full z-10 bg-white shadow-lg rounded-md p-2 min-w-40">
            <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded text-left" onClick={() => {
              AuthApi.logout();
            }}>Logout</button>
          </div>
        </div>

      </header>
      <Outlet />
    </div>
  );
}
