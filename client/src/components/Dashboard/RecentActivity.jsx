// RecentActivity.jsx
import React from 'react';
import { useDashboard } from '../../Context/DashboardContext';

const ActivityItem = ({ activity }) => {
  const getActivityColor = (type) => {
    switch (type) {
      case 'order': return 'bg-blue-100 text-blue-600';
      case 'payment': return 'bg-green-100 text-green-600';
      case 'reservation': return 'bg-purple-100 text-purple-600';
      case 'user': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-lg transition-colors">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getActivityColor(activity.type)}`}>
        {activity.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800">{activity.description}</p>
        <p className="text-xs text-slate-500 mt-1">{activity.timestamp}</p>
      </div>
    </div>
  );
};

const RecentActivity = () => {
  const { dashboardData, loading } = useDashboard();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
          <p className="text-sm text-slate-500">Latest updates from your restaurant</p>
        </div>
        <div className="text-2xl">📝</div>
      </div>
      
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : dashboardData.recentActivity.length > 0 ? (
          dashboardData.recentActivity.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            <div className="text-4xl mb-2">📭</div>
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
