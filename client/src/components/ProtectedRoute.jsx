//ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

const ProtectedRoute = ({ children, roles = [], resource = null, action = null }) => {
  const { isAuthenticated, user, loading, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  console.log("ProtectedRoute Check ->", {
    isAuthenticated,
    user,
    roles,
    resource,
    action
  });

  if (!isAuthenticated) {
    console.warn("User not authenticated");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !hasRole(roles)) {
    console.warn("User role not authorized:", user.role);
    return <Navigate to="/unauthorized" replace />;
  }

  if (resource) {
    if (user.role === 'admin') return children;

    if (action ? !hasPermission(resource, action) : !hasPermission(resource)) {
      console.warn("User lacks permission for:", resource, action);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
