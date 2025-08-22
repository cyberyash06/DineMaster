import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const OrderHeader = ({ user, onNewOrder }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
           
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Order Management
            </h1>
            <p className="text-slate-600 mt-1">
              Manage and track all restaurant orders
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">
              Welcome back, {user?.name || 'User'}
            </div>
            <button
              onClick={onNewOrder}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="w-5 h-5" />
              <span>New Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;
