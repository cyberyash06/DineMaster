import React from 'react';
import { getImageUrl } from '../utils/getImageURLs';

const MenuPanel = ({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  items = [],
  loading,
  onAddToCart
}) => {
  if (loading) {
    // Keep the shimmer/skeleton UI as before
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="flex gap-3 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 rounded-xl w-32"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-200 rounded-xl h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Category Tabs */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat._id || cat.id}
            onClick={() => setSelectedCategory(cat)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap shadow-md ${
              (selectedCategory?._id || selectedCategory?.id) === (cat._id || cat.id)
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:shadow-lg'
            }`}>
            <span className="text-xl">{cat.emoji}</span>
            {cat.name}
          </button>
        ))}
      </div>
      {/* Menu Items */}
      {items.length === 0 ? (
        <div className="text-center text-slate-500">No menu items.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  onError={e => {
                    e.target.src = 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=300&h=200&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
                  item.available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">{item.name}</h3>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{item.price?.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onAddToCart(item)}
                    disabled={!item.available}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPanel;
