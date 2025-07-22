import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  CogIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import DineMasterLogo from "../assets/logo";

{/* Inside Sidebar component */ }


const menu = [
  { to: "/dashboard", label: "Dashboard", icon: <HomeIcon className="w-6 h-6" /> },
  { to: "/staff", label: "Staff", icon: <UsersIcon className="w-6 h-6" /> },
  { to: "/settings", label: "Settings", icon: <CogIcon className="w-6 h-6" /> },
  { to: "/Menu", label: "Menu", icon: <ClipboardDocumentListIcon className="w-6 h-6" /> },
  { to: "/Inventory", label: "Inventories", icon: <CubeIcon className="w-6 h-6" /> },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-full bg-white text-black flex flex-col shadow-lg">
      <div className="flex justify-center items-center p-4">
        <div className="w-30 h-30 shadow-lg shadow-gray-800 rounded-full bg-indigo-900 flex justify-center items-center">
          <DineMasterLogo />
        </div>
      </div>

      <nav className="flex flex-col gap-1 mt-4">
        {menu.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex items-center gap-4 px-6 py-3 text-sm font-medium  hover:bg-gray-300 rounded-4xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-3 text-gray-700 
             "
              
            
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
