import { NavLink } from "react-router-dom";
import { HomeIcon, CogIcon, ChartPieIcon, UsersIcon } from "./icons";

const menu = [
  { to: "/dashboard", label: "Dashboard", icon: <HomeIcon /> },
  { to: "/dashboard/analytics", label: "Analytics", icon: <ChartPieIcon /> },
  { to: "/dashboard/users", label: "Users", icon: <UsersIcon /> },
  { to: "/dashboard/settings", label: "Settings", icon: <CogIcon /> },
];

export default function Sidebar({ collapsed, toggle }) {
  return (
    <aside
      className={`bg-indigo-700 text-white flex flex-col ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300`}
    >
      <div className="p-4 font-bold text-center">DineMaster</div>
      <nav className="flex-1 space-y-1 px-2">
        {menu.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive ? "bg-indigo-500" : "hover:bg-indigo-600"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            {icon}
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}