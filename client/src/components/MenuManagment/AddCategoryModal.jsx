// AddCategoryModal.jsx

import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const AddCategoryModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', emoji: '🍽️' });
  const [errors, setErrors] = useState({});
  const emojiOptions = ['🥗', '🍖', '🍰', '🥤', '🍕', '🍔', '🍜', '🥘', '🍣', '🧀', '🍎', '☕'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      setFormData({ name: '', emoji: '🍽️' });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({ name: '', emoji: '🍽️' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800">Add New Category</h2>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 outline-none transition-all text-sm sm:text-base ${
                  errors.name ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Enter category name"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>
            {/* Emojis */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Select Emoji
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-1 sm:gap-2">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                    className={`p-2 sm:p-3 text-xl sm:text-2xl rounded-lg sm:rounded-xl border-2 transition-all hover:scale-110 ${
                      formData.emoji === emoji 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-3 sm:gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-2 sm:px-4 py-2 sm:py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-2 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
