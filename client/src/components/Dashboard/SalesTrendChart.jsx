// SalesTrendChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useDashboard } from '../../Context/DashboardContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesTrendChart = () => {
  const { dashboardData, loading } = useDashboard();

  // Enhanced data validation
  const hasValidData = dashboardData.salesTrends && 
                      dashboardData.salesTrends.length > 0 &&
                      dashboardData.salesTrends.some(item => item.revenue > 0);

  const chartData = hasValidData ? {
    labels: dashboardData.salesTrends.map(item => 
      new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Revenue',
        data: dashboardData.salesTrends.map(item => item.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  } : {
    // Fallback data for empty state
    labels: ['No Data'],
    datasets: [
      {
        label: 'Revenue',
        data: [0],
        borderColor: 'rgba(148, 163, 184, 0.5)',
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            if (!hasValidData) {
              return 'No sales data available';
            }
            return `Revenue: ₹${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748b',
          display: hasValidData // Hide x-axis labels when no data
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: '#64748b',
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        },
        beginAtZero: true
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Sales Trends</h3>
          <p className="text-sm text-slate-500">
            {hasValidData ? 'Daily revenue over the past week' : 'No sales data available'}
          </p>
        </div>
        <div className="text-2xl">📈</div>
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
            <p className="text-slate-500 text-sm max-w-xs">
              Complete some orders with status 'served' to see sales trends. Revenue data will appear here once you have sales history.
            </p>
            <div className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
              💡 Tip: Make sure your orders have status 'served' to track revenue
            </div>
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default SalesTrendChart;
