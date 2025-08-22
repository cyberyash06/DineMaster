import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon, UsersIcon, CogIcon, ClipboardDocumentListIcon, Bars3Icon, XMarkIcon,
  ChartBarIcon, ShoppingCartIcon, ArrowRightOnRectangleIcon,
  ChevronLeftIcon, ChevronRightIcon,
} from "@heroicons/react/24/outline";
import DineMasterLogo from "./logo";
import { useAuth } from "../../Context/AuthContext"; // <-- Use context version!

// Map permitted resources to icons and labels
const PAGE_MAP = {
  dashboard: { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, to: "/dashboard" },
  menu: { label: "Menu Management", icon: <ClipboardDocumentListIcon className="w-5 h-5" />, to: "/menu" },
  orders: { label: "Order Management", icon: <ShoppingCartIcon className="w-5 h-5" />, to: "/orders" },
  users: { label: "User Management", icon: <UsersIcon className="w-5 h-5" />, to: "/users" },
  reports: { label: "Reports & Analytics", icon: <ChartBarIcon className="w-5 h-5" />, to: "/reports" },
  settings: { label: "Settings", icon: <CogIcon className="w-5 h-5" />, to: "/settings" },
};

export default function Sidebar() {
  const { user, allowedPages, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsOpen(v => !v);
  const toggleCollapse = () => setIsCollapsed(v => !v);

  if (!user || !user.role) return null;
  if (!Array.isArray(allowedPages)) return null; // robust for context load

  const isAdmin = user.role?.toLowerCase() === "admin" || allowedPages.includes("*");
  // Only show permitted pages
  const pagesToShow = isAdmin ? Object.keys(PAGE_MAP) : allowedPages.filter((key) => PAGE_MAP[key]);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-800 to-purple-600 flex items-center justify-center shadow-lg">
              <DineMasterLogo />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 capitalize">{user.role} Panel</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle Sidebar"
          >
            {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar w/ Collapse */}
      <aside
        className={`
          fixed top-0 left-0 h-full shadow-2xl z-50 
          bg-gradient-to-b from-slate-50 via-blue-50/40 to-purple-50/30
          transition-all duration-300 ease-in-out border-r border-slate-200/60
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:flex
          ${isCollapsed ? "md:w-20" : "w-60"}
        `}
      >
        <div className="flex flex-col w-full h-full">
          {/* Logo Section */}
          <div className={`border-b border-white/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 relative ${isCollapsed ? 'p-3' : 'p-5'}`}>
            <div className="flex flex-col items-center">
              {isCollapsed ? (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform">
                  <DineMasterLogo />
                </div>
              ) : (
                <div className="w-30 h-30 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform ring-4 ring-white/30">
                  <DineMasterLogo />
                </div>
              )}
              {isCollapsed && (
                <div className="mt-2 px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-md">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
              )}
            </div>
            {/* Collapse Toggle Button (Desktop Only) */}
            <button
              onClick={toggleCollapse}
              className="hidden md:flex absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-slate-300 rounded-full items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 text-slate-600 hover:text-slate-800"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
            </button>
          </div>

          {/* User Info - Hidden when collapsed */}
          {!isCollapsed && (
            <div className="p-3 pb-4 bg-gradient-to-r from-white/60 to-blue-50/60 border-b border-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-slate-600 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2 py-4' : 'px-3 py-5'}`}>
            <div className={`${isCollapsed ? 'space-y-2' : 'space-y-1'}`}>
              {pagesToShow.map((key) => {
                const page = PAGE_MAP[key];
                if (!page) return null;
                if (key === "settings" && !isAdmin) return null;
                return (
                  <NavLink
                    key={page.to}
                    to={page.to}
                    className={({ isActive }) =>
                      `group flex items-center transition-all duration-200 text-sm font-medium relative
                      ${isCollapsed ? 'justify-center p-3 rounded-xl' : 'gap-3 px-3 py-2.5 rounded-xl'}
                      ${isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]"
                        : "text-slate-700 hover:bg-white/70 hover:text-slate-900 hover:transform hover:scale-[1.01] hover:shadow-md"}`
                    }
                    onClick={() => setIsOpen(false)}
                    title={isCollapsed ? page.label : undefined}
                  >
                    <div className="transition-colors flex-shrink-0">{page.icon}</div>
                    {!isCollapsed && (
                      <>
                        <span className="font-medium truncate">{page.label}</span>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </>
                    )}
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {page.label}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* Footer Section */}
          <div className={`border-t border-white/50 bg-gradient-to-r from-slate-50/80 to-red-50/40 ${isCollapsed ? 'p-2' : 'p-3'}`}>
            <button
              onClick={logout}
              className={`w-full flex items-center text-sm font-medium text-red-600 hover:bg-white/70 hover:text-red-700 transition-all duration-200 group hover:shadow-md rounded-xl
                ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'}`
              }
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="truncate">Sign Out</span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </>
              )}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Sign Out
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
