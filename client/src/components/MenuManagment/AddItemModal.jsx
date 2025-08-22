import React, { useState } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { uploadMenuImage } from '../../lib/api/menuApi';
import { getImageUrl } from '../utils/getImageURLs'; // <--- import your helper

const AddItemModal = ({ isOpen, onClose, onSave, categoryName }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    available: true,
  });
  const [imagePreview, setImagePreview] = useState('/api/placeholder/200/150');
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Upload handler: just set path, not full URL
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setUploading(true);
        const data = await uploadMenuImage(file); // returns { url: '/uploads/xxx.jpg' }
        setImagePreview(data.url);
        setFormData(prev => ({ ...prev, image: data.url }));
        toast.success('Image uploaded successfully');
      } catch {
        toast.error('Failed to upload image');
      } finally {
        setUploading(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Item name is required';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0)
      newErrors.price = 'Valid price is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({ ...formData, price: parseFloat(formData.price) });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      image: '',
      available: true,
    });
    setImagePreview('/api/placeholder/200/150');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-800">Add New Item</h2>
              <p className="text-xs sm:text-base text-slate-600">to {categoryName}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ---- Image Upload ---- */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Item Image</label>
              <div className="mb-3">
                <img
                  src={getImageUrl(imagePreview)}                     // 🟢 Always use helper here!
                  alt="Preview"
                  className="w-full h-28 sm:h-32 object-cover rounded-xl border border-slate-200"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=300&h=200&fit=crop'; }}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="ai-image-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="ai-image-upload"
                  className={`flex-1 flex items-center justify-center gap-2 ${uploading
                    ? 'bg-slate-200 cursor-not-allowed'
                    : 'bg-slate-100 hover:bg-slate-200 cursor-pointer'
                  } border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-2 sm:p-3 transition-all text-xs sm:text-base`}
                >
                  <PhotoIcon className="w-5 h-5 text-slate-600" />
                  <span className="text-slate-600 font-medium">
                    {uploading ? 'Uploading...' : 'Browse Image'}
                  </span>
                </label>
              </div>
            </div>

            {/* ---- Name ---- */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Item Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 outline-none transition-all text-sm sm:text-base ${
                  errors.name ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Enter item name"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* ---- Price ---- */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 outline-none transition-all text-sm sm:text-base ${
                  errors.price ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-600">{errors.price}</p>
              )}
            </div>

            {/* ---- Description ---- */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 outline-none transition-all resize-none text-sm sm:text-base"
                placeholder="Enter item description"
              />
            </div>

            {/* ---- Availability ---- */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-xs sm:text-sm text-slate-700">
                Available for order
              </label>
            </div>

            {/* ---- Actions ---- */}
            <div className="flex gap-2 pt-3 sm:gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-2 sm:px-4 py-2 sm:py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg sm:rounded-xl font-medium transition-colors text-xs sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-2 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-medium transition-all text-xs sm:text-base disabled:opacity-50"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
