// RoleAwareWidgets.jsx
import React from 'react';

const AdminWidgets = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold">User Stats</h4>
        <div className="text-2xl">👥</div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Total Users:</span>
          <span className="font-bold">22</span>
        </div>
        <div className="flex justify-between">
          <span>Active Today:</span>
          <span className="font-bold">18</span>
        </div>
        <button className="w-full mt-3 bg-white/20 hover:bg-white/30 py-2 rounded-lg transition-colors">
          Manage Users
        </button>
      </div>
    </div>

    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold">Profit Summary</h4>
        <div className="text-2xl">💰</div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>This Month:</span>
          <span className="font-bold">₹2,45,000</span>
        </div>
        <div className="flex justify-between">
          <span>Growth:</span>
          <span className="font-bold">+15.2%</span>
        </div>
        <button className="w-full mt-3 bg-white/20 hover:bg-white/30 py-2 rounded-lg transition-colors">
          View Reports
        </button>
      </div>
    </div>

    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold">Role Management</h4>
        <div className="text-2xl">🛡️</div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Pending Approvals:</span>
          <span className="font-bold">3</span>
        </div>
        <div className="flex justify-between">
          <span>Active Roles:</span>
          <span className="font-bold">4</span>
        </div>
        <button className="w-full mt-3 bg-white/20 hover:bg-white/30 py-2 rounded-lg transition-colors">
          Manage Roles
        </button>
      </div>
    </div>
  </div>
);

const ManagerWidgets = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold">Reservation Load</h4>
        <div className="text-2xl">📅</div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Today's Bookings:</span>
          <span className="font-bold">8</span>
        </div>
        <div className="flex justify-between">
          <span>Peak Hours:</span>
          <span className="font-bold">7-9 PM</span>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold">Daily Sales</h4>
        <div className="text-2xl">📊</div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Today's Total:</span>
          <span className="font-bold">₹12,540</span>
        </div>
        <div className="flex justify-between">
          <span>Target Progress:</span>
          <span className="font-bold">85%</span>
        </div>
      </div>
    </div>
  </div>
);

const ChefWidgets = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold">Orders In Queue</h4>
        <div className="text-2xl">👨‍🍳</div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Pending Orders:</span>
          <span className="font-bold">5</span>
        </div>
        <div className="flex justify-between">
          <span>Avg. Prep Time:</span>
          <span className="font-bold">12 mins</span>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold">Menu Updates</h4>
        <div className="text-2xl">📝</div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Items to Review:</span>
          <span className="font-bold">2</span>
        </div>
        <div className="flex justify-between">
          <span>New Suggestions:</span>
          <span className="font-bold">1</span>
        </div>
      </div>
    </div>
  </div>
);

const WaiterWidgets = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold">Table Assignments</h4>
        <div className="text-2xl">🍽️</div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>My Tables:</span>
          <span className="font-bold">6</span>
        </div>
        <div className="flex justify-between">
          <span>Active Orders:</span>
          <span className="font-bold">3</span>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold">Pending Bills</h4>
        <div className="text-2xl">🧾</div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Unpaid Bills:</span>
          <span className="font-bold">3</span>
        </div>
        <div className="flex justify-between">
          <span>Total Amount:</span>
          <span className="font-bold">₹2,840</span>
        </div>
      </div>
    </div>
  </div>
);

const RoleAwareWidgets = ({ userRole }) => {
  const renderWidgets = () => {
    switch (userRole?.toLowerCase()) {
      case 'admin':
        return <AdminWidgets />;
      case 'manager':
        return <ManagerWidgets />;
      case 'chef':
        return <ChefWidgets />;
      case 'waiter':
        return <WaiterWidgets />;
      default:
        return <AdminWidgets />; // Default to admin widgets
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-slate-800">Role-Specific Widgets</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
          {userRole || 'Admin'}
        </span>
      </div>
      {renderWidgets()}
    </div>
  );
};

export default RoleAwareWidgets;
