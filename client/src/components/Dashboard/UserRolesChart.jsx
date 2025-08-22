// UserRoleschart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useDashboard } from '../../Context/DashboardContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserRolesChart = () => {
  const { dashboardData, loading } = useDashboard();

  const chartData = {
    labels: dashboardData.userRoles.map(role => role.role),
    datasets: [
      {
        label: 'Number of Users',
        data: dashboardData.userRoles.map(role => role.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(147, 51, 234)',
          'rgb(236, 72, 153)',
          'rgb(251, 146, 60)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
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
        bodyColor: '#fff'
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748b'
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: '#64748b',
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">User Roles</h3>
          <p className="text-sm text-slate-500">Staff distribution</p>
        </div>
        <div className="text-2xl">👥</div>
      </div>
      
      <div className="h-64">
        {loading ? (
          <div className="h-full bg-slate-100 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-slate-500">Loading chart...</div>
          </div>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default UserRolesChart;
