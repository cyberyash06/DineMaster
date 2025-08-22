import React from 'react';
import { useDashboard } from '../../Context/DashboardContext';
import {useAuth} from '../../Context/AuthContext';
import Button from '../ui/Button';

const DashboardHeader = () => {
  const { refreshData, loading } = useDashboard();
  const { user } = useAuth();

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              Welcome back, {user?.name || 'User'}! Here's your restaurant overview.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            <Button
              text="Refresh"
              variant="secondary"
              size="sm"
              loading={loading}
              onClick={refreshData}
              icon="🔄"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
