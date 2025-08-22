// src/components/ui/Select.jsx
import React from 'react';

const Select = React.forwardRef(
  ({ label, icon: Icon, error, className = '', children, ...props }, ref) => (
    <div className={"w-full " + className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-4 h-4" />
          </span>
        )}
        <select
          ref={ref}
          {...props}
          className={`w-full py-2 pr-4 
            ${Icon ? 'pl-10' : 'pl-3'} 
            border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error ? 'border-red-400' : 'border-gray-300'} 
            transition`}
        >
          {children}
        </select>
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
);

export default Select;
