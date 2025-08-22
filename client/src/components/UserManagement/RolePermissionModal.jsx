import React, { useState, useEffect } from 'react';
import { XMarkIcon, CogIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { updateRolePermissions, getRolePermissions } from '../../lib/api/roleApi';

const availablePages = [
  { name: 'dashboard', label: 'Dashboard', icon: '📊' },
  { name: 'orders', label: 'Order Management', icon: '📝' },
  { name: 'menu', label: 'Menu Management', icon: '🍽️' },
  { name: 'billing', label: 'Billing & Payments', icon: '💳' },
  { name: 'reports', label: 'Reports & Analytics', icon: '📈' },
  { name: 'users', label: 'User Management', icon: '👥' }
];

const roles = [
  { name: 'manager', label: 'Manager', color: 'bg-blue-100 text-blue-800' },
  { name: 'staff', label: 'Staff', color: 'bg-green-100 text-green-800' },
  { name: 'cashier', label: 'Cashier', color: 'bg-yellow-100 text-yellow-800' }
];

const emptyRolePermissions = { manager: [], staff: [], cashier: [] };

const RolePermissionModal = ({ isOpen, onClose }) => {
  const [rolePermissions, setRolePermissions] = useState(emptyRolePermissions);
  const [loading, setLoading] = useState(false);

  // Fetch current permissions from backend API on open
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getRolePermissions()
      .then((perms) => {
        // Transform API response to { manager: [...], staff: [...], cashier: [...] }
        const mapped = { ...emptyRolePermissions };
        perms.forEach(({ role, pages }) => {
          if (mapped[role]) mapped[role] = pages;
        });
        setRolePermissions(mapped);
      })
      .catch(() => {
        toast.error('Failed to load current role permissions');
        setRolePermissions(emptyRolePermissions);
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  // Toggle permission checkbox
  const handlePermissionToggle = (role, page) => {
    setRolePermissions(prev => {
      const currentPages = prev[role] || [];
      const has = currentPages.includes(page);
      return {
        ...prev,
        [role]: has
          ? currentPages.filter(p => p !== page)
          : [...currentPages, page]
      };
    });
  };

  // Save updated permissions to backend
  const handleSave = async () => {
    try {
      setLoading(true);
      await updateRolePermissions(rolePermissions);
      toast.success('Role permissions updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update permissions');
    } finally {
      setLoading(false);
    }
  };

  // Reset on close
  const handleClose = () => {
    setRolePermissions(emptyRolePermissions);
    onClose();
  };

  const hasPermission = (role, page) =>
    rolePermissions[role]?.includes(page) || false;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <UserGroupIcon className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Role Permission Management</h2>
                <p className="text-blue-100">Configure which pages each role can access</p>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-white/20 rounded-full">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="p-6">
          {/* Permission Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-slate-700">Page</th>
                  {roles.map(role => (
                    <th key={role.name} className="text-center px-4 py-4 font-semibold text-slate-700">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${role.color}`}>
                        {role.label}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {availablePages.map(page => (
                  <tr key={page.name} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="mr-2 text-xl">{page.icon}</span>
                      {page.label}
                    </td>
                    {roles.map(role => (
                      <td key={role.name} className="text-center px-4 py-4">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hasPermission(role.name, page.name)}
                            onChange={() => handlePermissionToggle(role.name, page.name)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                            disabled={loading}
                          />
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Role Permissions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionModal;
