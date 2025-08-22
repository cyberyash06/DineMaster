import { useState } from "react";
import { Outlet } from "react-router-dom";


export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
