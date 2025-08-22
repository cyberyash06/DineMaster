// components/Dashboard/TopSellingItemsChart.jsx - Updated version
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useDashboard } from '../../Context/DashboardContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const TopSellingItemsChart = () => {
  const { dashboardData, loading } = useDashboard();

  const colors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(147, 51, 234, 0.8)', 
    'rgba(236, 72, 153, 0.8)',
    'rgba(245, 101, 101, 0.8)',
    'rgba(251, 146, 60, 0.8)'
  ];

  // Handle empty or invalid data
  const hasValidData = dashboardData.topSellingItems && 
                      dashboardData.topSellingItems.length > 0 &&
                      dashboardData.topSellingItems.some(item => item.quantity > 0);

  const chartData = hasValidData ? {
    labels: dashboardData.topSellingItems.map(item => item.name),
    datasets: [
      {
        data: dashboardData.topSellingItems.map(item => item.quantity),
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 2,
        hoverOffset: 8
      }
    ]
  } : {
    // Fallback data for empty state
    labels: ['No Data Available'],
    datasets: [
      {
        data: [1],
        backgroundColor: ['#e5e7eb'],
        borderColor: ['#d1d5db'],
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context) {
            if (!hasValidData) {
              return 'No items sold yet';
            }
            const item = dashboardData.topSellingItems[context.dataIndex];
            return `${item.name}: ${item.quantity} sold (₹${item.revenue || 0})`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Top Selling Items</h3>
          <p className="text-sm text-slate-500">Most popular menu items</p>
        </div>
        <div className="text-2xl">🍽️</div>
      </div>
      
      <div className="h-80">
        {loading ? (
          <div className="h-full bg-slate-100 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-slate-500">Loading chart...</div>
          </div>
        ) : !hasValidData ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4">📊</div>
            <h4 className="text-lg font-semibold text-slate-700 mb-2">No Sales Data</h4>
            <p className="text-slate-500 text-sm">
              Complete some orders with status 'served' to see top selling items here.
            </p>
          </div>
        ) : (
          <Doughnut data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default TopSellingItemsChart;
