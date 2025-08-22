// Context/DashboardContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  getDashboardSummary,
  getSalesTrends,
  getTopSellingItems,
  getUserRolesDistribution,
  getRecentActivities,
} from '../lib/api/dashboardApi';

const DashboardContext = createContext();

const initialState = {
  loading: true,
  error: null,
  dashboardData: {
    kpis: {
      todaysOrders: 0,
      totalRevenue: 0,
      activeReservations: 0,
      pendingBills: 0,
      trends: {
        orders: 0,
        revenue: 0,
        reservations: 0,
        bills: 0
      }
    },
    salesTrends: [],
    topSellingItems: [],
    userRoles: [],
    recentActivity: []
  }
};

const dashboardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'SET_DASHBOARD_DATA':
      return {
        ...state,
        loading: false,
        error: null,
        dashboardData: action.payload
      };
    case 'SET_KPI_DATA':
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          kpis: action.payload
        }
      };
    case 'SET_SALES_TRENDS':
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          salesTrends: action.payload
        }
      };
    case 'SET_TOP_ITEMS':
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          topSellingItems: action.payload
        }
      };
    case 'SET_USER_ROLES':
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          userRoles: action.payload
        }
      };
    case 'SET_RECENT_ACTIVITY':
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          recentActivity: action.payload
        }
      };
    default:
      return state;
  }
};

export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const fetchDashboardData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Fetch all data in parallel
      const [summary, salesTrends, topItems, userRoles, activities] = await Promise.all([
        getDashboardSummary().catch(err => {
          console.error('Summary fetch failed:', err);
          return {
            todaysOrders: 0,
            todaysRevenue: 0,
            activeReservations: 0,
            pendingBills: 0,
            trends: { orders: { percentage: 0 }, revenue: { percentage: 0 } }
          };
        }),
        getSalesTrends().catch(err => {
          console.error('Sales trends fetch failed:', err);
          return [];
        }),
        getTopSellingItems().catch(err => {
          console.error('Top items fetch failed:', err);
          return [];
        }),
        getUserRolesDistribution().catch(err => {
          console.error('User roles fetch failed:', err);
          return [];
        }),
        getRecentActivities().catch(err => {
          console.error('Activities fetch failed:', err);
          return [];
        }),
      ]);

      // Transform data to match your component structure
      const transformedData = {
        kpis: {
          todaysOrders: summary.todaysOrders || 0,
          totalRevenue: summary.todaysRevenue || 0,
          activeReservations: summary.activeReservations || 0,
          pendingBills: summary.pendingBills || 0,
          trends: {
            orders: parseFloat(summary.trends?.orders?.percentage) || 0,
            revenue: parseFloat(summary.trends?.revenue?.percentage) || 0,
            reservations: 0,
            bills: 0
          }
        },
        salesTrends: salesTrends.map(trend => ({
          date: trend._id,
          revenue: trend.revenue || 0,
          orders: trend.orders || 0
        })),
        topSellingItems: topItems.map(item => ({
          name: item.name || 'Unknown Item',
          quantity: item.quantity || 0,
          revenue: item.revenue || 0
        })),
        userRoles: userRoles.map(role => ({
          role: role._id.charAt(0).toUpperCase() + role._id.slice(1),
          count: role.count || 0
        })),
        recentActivity: activities.map(activity => ({
          id: activity.id,
          type: activity.type,
          description: activity.title + ' - ' + activity.description,
          timestamp: formatTimestamp(activity.timestamp),
          icon: getActivityIcon(activity.type)
        }))
      };

      dispatch({ type: 'SET_DASHBOARD_DATA', payload: transformedData });
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const refreshData = async () => {
    await fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / 1000 / 60);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} mins ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return time.toLocaleDateString();
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'user':
        return '👤';
      case 'payment':
        return '💳';
      case 'reservation':
        return '🍽️';
      default:
        return '📋';
    }
  };

  return (
    <DashboardContext.Provider 
      value={{
        ...state,
        refreshData
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
