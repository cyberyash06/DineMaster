// CategoryHeaderBar.jsx

import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const CategoryHeaderBar = ({ selectedCategory, onAddItem }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl">{selectedCategory.emoji}</span>
          <div>
            <h3 className="text-lg sm:text-2xl font-bold text-slate-800">
              {selectedCategory.name}
            </h3>
            <p className="text-slate-500 text-xs sm:text-base">
              {selectedCategory.items?.length ?? selectedCategory.itemCount ?? 0} items in this category
            </p>
          </div>
        </div>
        <button
          onClick={onAddItem}
          className="mt-2 sm:mt-0 flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Item</span>
        </button>
      </div>
    </div>
  );
};

export default CategoryHeaderBar;
