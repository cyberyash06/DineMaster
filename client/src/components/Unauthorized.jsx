import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();

  const getRoleBasedHome = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'manager':
        return '/manager/dashboard';
      case 'staff':
        return '/staff/orders';
      case 'cashier':
        return '/cashier/orders';
      default:
        return '/staff/orders';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h1>
        <p className="text-slate-600 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="space-y-3">
          <Link
            to={getRoleBasedHome()}
            className="block w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/login"
            className="block w-full px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Sign In Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
