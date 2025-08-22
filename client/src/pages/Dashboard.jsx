// pages/Dashboard.jsx - Updated version
import React from 'react';
import { DashboardProvider } from '../Context/DashboardContext';
import KPICards from '../components/Dashboard/KPICards';
import SalesTrendChart from '../components/Dashboard/SalesTrendChart';
import TopSellingItemsChart from '../components/Dashboard/TopSellingItemsChart';
import UserRolesChart from '../components/Dashboard/UserRolesChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import RoleAwareWidgets from '../components/Dashboard/RoleAwareWidgets';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import { Toaster } from 'sonner';
import { useAuth } from '../Context/AuthContext'; // Use the context version

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Toaster richColors position="top-right" closeButton />
        
        {/* Header */}
        <DashboardHeader />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* KPI Cards */}
          <KPICards />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <SalesTrendChart />
            </div>
            <div>
              <TopSellingItemsChart />
            </div>
          </div>

          {/* Secondary Charts and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <UserRolesChart />
            </div>
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
          </div>

          {/* Role-Aware Widgets */}
          <RoleAwareWidgets userRole={user?.role} />
        </div>
      </div>
    </DashboardProvider>
  );
};

export default Dashboard;
