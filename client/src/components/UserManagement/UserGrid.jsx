import React from 'react';
import UserCard from './UserCard';

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 animate-pulse shadow-lg p-6">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 h-16 bg-slate-200 rounded-full" />
      <div className="flex-1">
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-slate-100 rounded w-full" />
      <div className="h-3 bg-slate-100 rounded w-2/3" />
    </div>
    <div className="flex gap-2">
      <div className="h-8 w-20 bg-slate-100 rounded" />
      <div className="h-8 w-16 bg-slate-100 rounded" />
    </div>
  </div>
);

const UserGrid = ({ users, loading, onViewUser, onEditUser, onDeleteUser }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-xl font-semibold text-slate-600 mb-2">No users found</h3>
        <p className="text-slate-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {users.map(user => (
        <UserCard
          key={user._id}
          user={user}
          onView={onViewUser}
          onEdit={onEditUser}
          onDelete={onDeleteUser}
           
        />
      ))}
    </div>
  );
};

export default UserGrid;
