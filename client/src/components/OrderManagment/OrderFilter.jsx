import React from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const OrderFilters = ({ 
  statusFilter, 
  paymentFilter, 
  searchTerm,
  onStatusFilterChange, 
  onPaymentFilterChange,
  onSearchChange,
  totalOrders,
  filteredCount
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Side - Total Orders */}
        <div className="flex items-center gap-4">
          <div className="text-left">
            <div className="text-2xl font-bold text-slate-800">{filteredCount}</div>
            <div className="text-sm text-slate-500">
              {filteredCount === totalOrders ? 'Total Orders' : `of ${totalOrders} orders`}
            </div>
          </div>
          
          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Complete">Complete</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Payment Filter Dropdown */}
          <div className="relative">
            <select
              value={paymentFilter}
              onChange={(e) => onPaymentFilterChange(e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 max-w-md mx-auto lg:mx-0">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Search by table, customer, or order ID..."
            />
          </div>
        </div>

        {/* Right Side - Additional Filters (if needed) */}
        <div className="flex items-center gap-2">
          {(statusFilter !== 'All' || paymentFilter !== 'All' || searchTerm) && (
            <button
              onClick={() => {
                onStatusFilterChange('All');
                onPaymentFilterChange('All');
                onSearchChange('');
              }}
              className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
