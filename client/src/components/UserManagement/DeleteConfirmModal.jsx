import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getImageUrl } from '../utils/getImageURLs';

const DeleteConfirmModal = ({ user, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !user) return null;

  

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Delete User</h2>
                <p className="text-red-100">This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
            <img
              src={getImageUrl(user.profilePicture, '64/64')}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face';
              }}
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-800">{user.name}</h3>
              <p className="text-slate-600">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                  user.role === 'staff' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  user.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 mb-2">Warning</h4>
                <p className="text-red-700 text-sm mb-2">
                  You are about to permanently delete this user account. This action will:
                </p>
                <ul className="text-red-700 text-sm space-y-1 list-disc list-inside">
                  <li>Remove all user data permanently</li>
                  <li>Revoke all permissions and access</li>
                  <li>Cannot be undone</li>
                  {user.role === 'admin' && (
                    <li className="font-semibold">Delete an admin account (ensure at least one admin remains)</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Text */}
          <div className="mb-6">
            <p className="text-slate-700 text-center">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{user.name}</span>?
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all"
            >
              <TrashIcon className="w-5 h-5" />
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
