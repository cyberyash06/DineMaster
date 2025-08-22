import React from 'react';
import { XMarkIcon, EnvelopeIcon, PhoneIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { getImageUrl } from '../utils/getImageURLs';


const ViewUserModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">User Profile</h2>
              <p className="text-blue-100">Complete user information</p>
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
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <img
                src={getImageUrl(user.profilePicture, '64/64')}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-200"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face';
                }}
              />
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white ${
                user.status === 'active' ? 'bg-green-400' : 'bg-red-400'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{user.name}</h3>
              <div className="flex gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                  user.status === 'active' 
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-red-100 text-red-800 border-red-200'
                }`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                  user.role === 'manager' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  user.role === 'staff' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                  'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5" />
                Contact Information
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Email</label>
                  <p className="text-slate-800">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Mobile</label>
                  <p className="text-slate-800">{user.mobile}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Work Information
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Role</label>
                  <p className="text-slate-800 capitalize">{user.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Joined Date</label>
                  <p className="text-slate-800 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(user.joinedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="mb-6">
            <h4 className="font-semibold text-slate-800 mb-4">Role Permissions</h4>
            <div className="bg-slate-50 rounded-xl p-4">
              {user.permissions && user.permissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.permissions.map((perm, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
                      <h5 className="font-medium text-slate-800 capitalize mb-2">{perm.resource}</h5>
                      <div className="flex gap-2 flex-wrap">
                        {perm.actions.map(action => (
                          <span key={action} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded capitalize">
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">No specific permissions assigned</p>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-6 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
