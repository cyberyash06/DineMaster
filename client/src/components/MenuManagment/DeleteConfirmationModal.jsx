import React from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, target }) => {
  if (!isOpen || !target) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800">Confirm Delete</h2>
                <p className="text-xs sm:text-sm text-slate-600">This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="mb-4 sm:mb-6">
            <p className="text-slate-700 text-xs sm:text-base">
              Are you sure you want to delete{' '}
              <span className="font-semibold break-all">"{target.name}"</span>?
              {target.type === 'category' && (
                <span className="block text-xs sm:text-sm text-slate-500 mt-1">
                  This will also delete all items in this category.
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-2 sm:px-4 py-2 sm:py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg sm:rounded-xl font-medium transition-colors text-xs sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-2 sm:px-4 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg sm:rounded-xl font-medium transition-colors text-xs sm:text-base"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
