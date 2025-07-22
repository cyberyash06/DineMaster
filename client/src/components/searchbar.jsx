import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchBar({ placeholder = "Search...", onChange }) {
  return (
    <div className="relative text-gray-600 w-full max-w-xs">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
