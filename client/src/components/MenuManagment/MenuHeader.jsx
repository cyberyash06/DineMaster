// MenuHeader.jsx
import React from 'react';
import {useAuth} from '../../Context/AuthContext';

const MenuHeader = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Menu Management
            </h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              Manage your restaurant's menu items and categories
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-xs sm:text-sm text-slate-500">
              Welcome back, {user?.name || 'User'}
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuHeader;
