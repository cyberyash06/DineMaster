// src/pages/Dashboard.jsx
import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <p className="text-lg mb-8">
        You are logged in as an Admin.
      </p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Go to Admin Panel
      </button>
    </div>
  );
};

export default Dashboard;