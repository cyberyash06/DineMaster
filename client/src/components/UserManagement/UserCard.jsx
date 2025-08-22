import React from 'react';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getImageUrl } from '../utils/getImageURLs'; // correct import path!

const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-red-100 text-red-800 border-red-200'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const RoleBadge = ({ role }) => {
  const styles = {
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
    manager: 'bg-blue-100 text-blue-800 border-blue-200',
    staff: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cashier: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[role] || styles.staff}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

const UserCard = ({ user, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 group transition-all hover:shadow-xl flex flex-col h-full">
      <div className="flex items-center gap-4 px-5 pt-5">
        <div className="relative">
          <img
            src={getImageUrl(user.profilePicture)}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 bg-slate-100"
            onError={e => {
              e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face';
            }}
          />
          <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            user.status === 'active' ? 'bg-green-400' : 'bg-red-400'
          }`} />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="font-bold text-base text-slate-800 truncate">{user.name}</h3>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
        </div>
      </div>

      <div className="flex flex-row gap-2 px-5 mt-3">
        <RoleBadge role={user.role} />
        <StatusBadge status={user.status} />
      </div>

      <div className="border-t border-slate-100 mx-5 my-3" />

      <div className="flex-1 px-5 flex flex-col justify-between min-h-[54px]">
        <span className="text-xs text-slate-400">
          Joined:{" "}
          <span className="text-slate-700">{new Date(user.joinedAt).toLocaleDateString()}</span>
        </span>
      </div>

      <div className="flex min-w-0 gap-4 px-4 pb-4 pt-2 ">
        <button
          onClick={() => onView(user)}
          className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          title="View"
        >
          <EyeIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(user)}
          className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-700  hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
          title="Edit"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(user)}
          className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
          title="Delete"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default UserCard;
