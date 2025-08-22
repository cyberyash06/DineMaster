//KPIcards.jsx
import React from 'react';
import { useDashboard } from '../../Context/DashboardContext';

const KPICard = ({ title, value, icon, trend, loading }) => {
  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return '↗️';
    if (trend < 0) return '↘️';
    return '➡️';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(trend)}`}>
            <span>{getTrendIcon(trend)}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-slate-600 text-sm font-medium">{title}</h3>
        {loading ? (
          <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
        ) : (
          <p className="text-3xl font-bold text-slate-800">
            {typeof value === 'number' && title.includes('Revenue') 
              ? `₹${value.toLocaleString()}` 
              : value.toLocaleString()
            }
          </p>
        )}
      </div>
    </div>
  );
};

const KPICards = () => {
  const { dashboardData, loading } = useDashboard();
  const { kpis } = dashboardData;

  const kpiData = [
    {
      title: "Today's Orders",
      value: kpis.todaysOrders,
      icon: '📦',
      trend: kpis.trends.orders
    },
    {
      title: 'Total Revenue',
      value: kpis.totalRevenue,
      icon: '💰',
      trend: kpis.trends.revenue
    },
    {
      title: 'Active Reservations',
      value: kpis.activeReservations,
      icon: '🍽️',
      trend: kpis.trends.reservations
    },
    {
      title: 'Pending Bills',
      value: kpis.pendingBills,
      icon: '🧾',
      trend: kpis.trends.bills
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => (
        <KPICard key={index} {...kpi} loading={loading} />
      ))}
    </div>
  );
};

export default KPICards;
