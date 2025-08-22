// CategorySection.jsx

import React from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SkeletonCategoryChip = () => (
  <div className="animate-pulse flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 w-24 h-10 sm:w-32 sm:h-14" />
);

const getCategoryId = category => category?.id ?? category?._id;
const getItemCount = category =>
  typeof category?.itemCount === 'number' ? category.itemCount
  : Array.isArray(category?.items) ? category.items.length
  : 0;

const CategoryChip = ({ category, isSelected, onSelect, onDelete }) => {
  const itemCount = getItemCount(category);

  return (
    <div
      className={`
        relative group flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 cursor-pointer min-w-[70px] sm:min-w-max
        ${isSelected
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-[1.03]'
          : 'bg-white text-slate-700 hover:bg-slate-50 shadow hover:shadow-lg border border-slate-200'
        }
      `}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      onKeyDown={e => { if (e.key === 'Enter') onSelect(); }}
    >
      <span className="text-xl">{category.emoji}</span>
      <div className="flex flex-col">
        <span className="font-semibold text-sm sm:text-base">{category.name}</span>
        <span className={`text-xs sm:text-sm ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
          {itemCount} item{itemCount === 1 ? '' : 's'}
        </span>
      </div>
      {itemCount === 0 && (
        <button
          onClick={e => {
            e.stopPropagation();
            onDelete(getCategoryId(category));
          }}
          className={`
            absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200
            ${isSelected
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-red-100 text-red-600 hover:bg-red-200 opacity-0 group-hover:opacity-100'
            }
          `}
          title="Delete category"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

const CategorySection = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onDeleteCategory,
  onAddCategory,
  loading = false
}) => (
  <div className="space-y-3">
    <h2 className="text-lg sm:text-xl font-semibold text-slate-800 px-2">Categories</h2>
    <div className="flex overflow-x-auto pb-3 scrollbar-hide -mx-2 px-2">
      <div className="flex gap-2 sm:gap-3 min-w-max">
        {loading ? (
          <>
            {Array.from({ length: 4 }).map((_, idx) => <SkeletonCategoryChip key={idx} />)}
            <div className="animate-pulse bg-slate-100 w-20 h-10 sm:w-28 sm:h-14 rounded-lg sm:rounded-xl" />
          </>
        ) : (
          <>
            {categories.map(category => {
              const catId = getCategoryId(category);
              const isSelected =
                Boolean(selectedCategory && getCategoryId(selectedCategory) === catId);

              return (
                <CategoryChip
                  key={catId}
                  category={category}
                  isSelected={isSelected}
                  onSelect={() => onSelectCategory(category)}
                  onDelete={onDeleteCategory}
                />
              );
            })}
            <button
              onClick={onAddCategory}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all duration-200 min-w-max border-2 border-dashed border-slate-300 hover:border-slate-400 text-sm sm:text-base"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Category</span>
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);

export default CategorySection;
