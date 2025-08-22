import React, { useState } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { uploadProfilePicture } from '../../lib/api/userApi';
import { getImageUrl } from '../utils/getImageURLs'; // use the correct import path!

// Password validation rules
const passwordRules = [
  { label: '8+ characters', test: v => /.{8,}/.test(v) },
  { label: 'Uppercase letter', test: v => /[A-Z]/.test(v) },
  { label: 'Lowercase letter', test: v => /[a-z]/.test(v) },
  { label: 'Number', test: v => /\d/.test(v) },
  { label: 'Special character', test: v => /[^a-zA-Z0-9]/.test(v) }
];

const RegisterUserModal = ({ isOpen, onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: 'staff'
  });
  const [profilePicture, setProfilePicture] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  // Track password rules satisfaction
  const passwordChecks = passwordRules.map(rule => 
    rule.test(formData.password)
  );

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      // The API should return { url: '...' }
      const data = await uploadProfilePicture(file);
      setProfilePicture(data.url);
      toast.success('Profile picture uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordChecks.every(Boolean)) {
      newErrors.password = 'Password is not strong enough';
    }
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      onRegister({
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
      password: '',
      confirmPassword: '',
      role: 'staff'
    });
    setProfilePicture('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Register New User</h2>
              <p className="text-blue-100">Add a new team member</p>
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
                onError={e => {
                  e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face';
                }}
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="profile-upload"
                  className={`flex items-center gap-2 px-4 py-2 ${
                    uploading ? 'bg-slate-200 cursor-not-allowed' : 'bg-slate-100 hover:bg-slate-200 cursor-pointer'
                  } rounded-lg transition-colors`}
                >
                  <PhotoIcon className="w-5 h-5" />
                  <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
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

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 outline-none transition-all ${
                  errors.password ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Enter password"
              />
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
              {/* Password strength rules */}
              {formData.password && (
                <div className="mt-2 text-xs space-y-1">
                  {passwordRules.map((rule, i) => (
                    <div
                      key={rule.label}
                      className={passwordChecks[i] ? "text-green-600" : "text-red-500"}
                    >
                      {passwordChecks[i] ? "✓" : "✗"} {rule.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 outline-none transition-all ${
                  errors.confirmPassword ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
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
              Register User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserModal;
