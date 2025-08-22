import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../components/Layouts/AdminLayout";
import StaffLayout from "../components/Layouts/StaffLayout";

import Dashboard from "../pages/Dashboard";
import MenuManagement from "../pages/MenuManagment";
import OrderManagement from "../pages/OrderManagement";
import UserManagement from "../pages/UserManagement";
import Unauthorized from "../components/Unauthorized";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ---- Pure RBAC, dynamic access ---- */}

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute resource="dashboard">
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Menu Management */}
      <Route
        path="/menu"
        element={
          <ProtectedRoute resource="menu">
            <AdminLayout>
              <MenuManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Order Management */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute resource="orders">
            <AdminLayout>
              <OrderManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* User Management */}
      <Route
        path="/users"
        element={
          <ProtectedRoute resource="users">
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* More pages (e.g. billing, reports) */}
      {/* <Route ... /> */}

      {/* Staff-only layout for cashier/staff roles if you need a UI distinction */}
      {/* Most systems use AdminLayout for all, but you can use StaffLayout if you have significant sidebar/topbar differences. */}

      {/* 404/fallback */}
      <Route path="*" element={<Navigate to="/unauthorized" replace />} />
    </Routes>
  );
}
