import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getImageUrl } from '../utils/getImageURLs';


const SkeletonFoodCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 animate-pulse shadow-lg h-80 flex flex-col">
    <div className="bg-slate-200 h-40 w-full rounded-t-2xl" />
    <div className="flex-1 p-5 flex flex-col gap-2">
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
      <div className="mt-2 h-4 bg-slate-200 rounded w-20" />
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-1/2 bg-slate-100 rounded-lg" />
        <div className="h-8 w-1/2 bg-slate-100 rounded-lg" />
      </div>
    </div>
  </div>
);

// 🟢 FIXED: Helper to get ID regardless of MongoDB or JS object
const getItemId = item => item?._id || item?.id;

const FoodItemCard = ({ item, onEdit, onDelete, onToggleAvailability, canEdit }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 overflow-hidden group">
    {/* Image */}
    <div className="relative overflow-hidden">
      <img
        src={getImageUrl(item.image)}
        alt={item.name||'default food'}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        onError={e => {
          e.target.src = 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=300&h=200&fit=crop';
        }}
      />
      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 pointer-events-none" />
      {/* Availability Badge */}
      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
        item.available 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {item.available ? 'Available' : 'Unavailable'}
      </div>
    </div>
    {/* Content */}
    <div className="p-5">
      <h4 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">{item.name}</h4>
      {item.description && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.description}</p>
      )}
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold text-blue-600">₹{item.price?.toFixed(2)}</span>
        {canEdit && (
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={item.available}
              onChange={() => onToggleAvailability(getItemId(item))}
            
              className="sr-only"
            />
            <div className={`relative w-11 h-6 transition-colors duration-200 ease-in-out rounded-full ${
              item.available ? 'bg-green-400' : 'bg-gray-300'
            }`}>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                item.available ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </div>
          </label>
        )}
      </div>
      {/* Action Buttons */}
      {canEdit && (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
          >
            <PencilIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Edit</span>
          </button>
          <button
            onClick={() => onDelete(item)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
          >
            <TrashIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Delete</span>
          </button>
        </div>
      )}
    </div>
  </div>
);

const FoodItemGrid = ({
  items,
  searchTerm,
  selectedCategory,
  onEditItem,
  onDeleteItem,
  onToggleAvailability,
  canEdit,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(6)].map((_, idx) => <SkeletonFoodCard key={idx} />)}
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-semibold text-slate-600 mb-2">Select a Category</h3>
        <p className="text-slate-500">Choose a category to view and manage menu items</p>
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-semibold text-slate-600 mb-2">
          {searchTerm ? 'No items found' : 'No items yet'}
        </h3>
        <p className="text-slate-500">
          {searchTerm 
            ? 'Try adjusting your search criteria' 
            : 'Start adding items to this category'
          }
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-800">
           {searchTerm && `Menu Items(${items.length} found)`}
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* 🟢 FIXED: Use getItemId for React key */}
        {items.map(item => (
          <FoodItemCard
            key={getItemId(item)}
            item={item}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
            onToggleAvailability={onToggleAvailability}
            canEdit={canEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodItemGrid;
