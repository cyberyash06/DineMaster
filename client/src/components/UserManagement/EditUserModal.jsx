import React, { useState, useEffect } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { uploadProfilePicture } from '../../lib/api/userApi';
import { getImageUrl } from '../utils/getImageURLs'; // use the correct path!

const EditUserModal = ({ user, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'staff',
    status: 'active'
  });
  const [profilePicture, setProfilePicture] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        role: user.role || 'staff',
        status: user.status || 'active'
      });
      setProfilePicture(user.profilePicture || '');
      setErrors({});
    }
  }, [user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setUploading(true);
        const data = await uploadProfilePicture(file);
        setProfilePicture(data.url);
        toast.success('Profile picture updated');
      } catch (error) {
        toast.error('Failed to upload image');
      } finally {
        setUploading(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate({
        ...formData,
        profilePicture
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      role: 'staff',
      status: 'active'
    });
    setProfilePicture('');
    setErrors({});
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Edit User</h2>
              <p className="text-blue-100">Update user information</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <img
                src={getImageUrl(profilePicture)}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face';
                }}
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-upload-edit"
                  disabled={uploading}
                />
                <label
                  htmlFor="profile-upload-edit"
                  className={`flex items-center gap-2 px-4 py-2 ${
                    uploading ? 'bg-slate-200 cursor-not-allowed' : 'bg-slate-100 hover:bg-slate-200 cursor-pointer'
                  } rounded-lg transition-colors`}
                >
                  <PhotoIcon className="w-5 h-5" />
                  <span>{uploading ? 'Uploading...' : 'Change Photo'}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 outline-none transition-all ${
                  errors.name ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 outline-none transition-all ${
                  errors.email ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 outline-none transition-all ${
                  errors.mobile ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Enter mobile number"
              />
              {errors.mobile && <p className="text-red-600 text-xs mt-1">{errors.mobile}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="staff">Staff</option>
                <option value="cashier">Cashier</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Account Status *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === 'active'}
                    onChange={handleInputChange}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === 'inactive'}
                    onChange={handleInputChange}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-sm">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
