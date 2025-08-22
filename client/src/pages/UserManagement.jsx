import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CogIcon } from '@heroicons/react/24/outline';

import UserFilters from '../components/UserManagement/UserFilters';
import UserGrid from '../components/UserManagement/UserGrid';
import RegisterUserModal from '../components/UserManagement/RegisterUserModal';
import ViewUserModal from '../components/UserManagement/ViewUserModal';
import EditUserModal from '../components/UserManagement/EditUserModal';
import DeleteConfirmModal from '../components/UserManagement/DeleteConfirmModal';
import RolePermissionModal from '../components/UserManagement/RolePermissionModal'; // ✅
import { getUsers, createUser, updateUser, deleteUser } from '../lib/api/userApi';

const UserManagement = () => {
  // User data
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRolePermissionModal, setShowRolePermissionModal] = useState(false);
  // Selected users for actions
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users from API with filters
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers({
        search: searchTerm,
        role: roleFilter,
        status: statusFilter
      });
      setUsers(res.users);
      setFilteredUsers(res.users); // Optionally: Filter in frontend if backend doesn't support
    } catch (error) {
      toast.error('Failed to load users');
    }
    setLoading(false);
  };

  // Refetch when filters change or on mount
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [searchTerm, roleFilter, statusFilter]);

  // --- Handlers for modals/actions ---

  // 👁️ View user
  const handleViewUser = user => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // ✏️ Edit user
  const handleEditUser = user => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // 🗑️ Ask to confirm delete
  const handleDeleteClick = user => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // ➕ Register a user (modal finish)
  const handleRegisterUser = async userData => {
    try {
      await createUser(userData);
      toast.success('User registered successfully');
      setShowRegisterModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to register user'
      );
    }
  };

  // ✏️ Save user edits
  const handleUpdateUser = async (updatedData) => {
    if (!selectedUser) return;
    try {
      await updateUser(selectedUser._id, updatedData);
      toast.success('User updated successfully');
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update user'
      );
    }
  };

  // 🗑️ Confirm delete
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete._id);
      toast.success('User deleted');
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete user'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Permissions button */}
      <div className="bg-white/80 backdrop-blur-md  border-b border-slate-200 p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">User Management</h1>
                <p className="text-slate-600 mt-1 text-sm sm:text-base">
                  Manage users, roles, and permissions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-slate-600 text-sm sm:text-base">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              {/* Role Permissions */}
              <button
                onClick={() => setShowRolePermissionModal(true)}
                className="flex items-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                <CogIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Role Permissions</span>
                <span className="sm:hidden">Permissions</span>
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="flex items-center gap-2 px-4 py-3 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-all shadow-md hover:shadow-lg"
              >
                <span className="hidden sm:inline">Register User</span>
                <span className="sm:hidden">Register</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <UserFilters
          searchTerm={searchTerm}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onRoleFilterChange={setRoleFilter}
          onStatusFilterChange={setStatusFilter}
          totalUsers={users.length}
          filteredCount={filteredUsers.length}
        />

        <UserGrid
          users={filteredUsers}
          loading={loading}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteClick}
        />
      </div>

      {/* Modals */}
      <RegisterUserModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegisterUser}
      />

      <ViewUserModal
        user={selectedUser}
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedUser(null);
        }}
      />

      <EditUserModal
        user={selectedUser}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onUpdate={handleUpdateUser}
      />

      <DeleteConfirmModal
        user={userToDelete}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteUser}
      />

      {/* New Role Permission Modal */}
      <RolePermissionModal
        isOpen={showRolePermissionModal}
        onClose={() => setShowRolePermissionModal(false)}
      />
    </div>
  );
};

export default UserManagement;
