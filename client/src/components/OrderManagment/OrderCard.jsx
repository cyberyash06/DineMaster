// components/OrderManagment/OrderCard.jsx - Updated with auto-serve and disabled edit
import React from 'react';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

// Utility badges
const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    preparing: 'bg-blue-100 text-blue-800 border-blue-200',
    ready: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    served: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    default: 'bg-slate-100 text-slate-800 border-slate-200'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles['default']}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PaymentBadge = ({ status }) => {
  const styles = {
    Paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Unpaid: 'bg-red-100 text-red-800 border-red-200'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || ''}`}>{status}</span>
  );
};

const formatTimeAgo = (createdAt) => {
  const now = new Date();
  const orderTime = new Date(createdAt);
  const diffMs = now - orderTime;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return orderTime.toLocaleDateString();
};

const OrderCard = ({ order, onViewBill, onEditOrder, onDeleteOrder, onMarkAsPaid }) => {
  const subtotal = order.items.reduce(
    (sum, it) => sum + (it.menuItem?.price || 0) * (it.quantity || 0), 0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const isPaid = order.paymentStatus === 'Paid';
  
  
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">#{order._id.slice(-4)}</h3>
            <p className="text-slate-600">{order.customerName || 'Walk-in Customer'}</p>
            <p className="text-sm text-slate-500">Table {order.tableNumber || 'N/A'}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <StatusBadge status={order.status} />
            <PaymentBadge status={order.paymentStatus || 'Unpaid'} />
          </div>
        </div>

        {/* Items Preview */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Items:</h4>
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-slate-600">
                  {item.quantity}x {item.menuItem?.name || 'Unknown Item'}
                </span>
                <span className="text-blue-600 font-medium">
                  ₹{((item.menuItem?.price || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            {order.items.length > 2 && (
              <p className="text-xs text-slate-500 italic">
                +{order.items.length - 2} more items
              </p>
            )}
          </div>
          <div className="border-t border-slate-200 mt-3 pt-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">Total:</span>
              <span className="text-xl font-bold text-blue-600">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="mb-4">
          <p className="text-xs text-slate-500">{formatTimeAgo(order.createdAt)}</p>
        </div>

        {/* Action Buttons - Updated with conditional edit button */}
        <div className="space-y-3">
          {/* Top Row - Always 3 buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="secondary"
              size="sm"
              
              onClick={() => onViewBill(order)}
              text="View"
            />
            
            {/* Edit Button - Disabled for paid orders */}
            <Button
              variant="basic"
              size="sm"
             
              onClick={() => onEditOrder(order)}
              text="Edit"
              disabled={isPaid}
              className={isPaid ? "opacity-60 cursor-not-allowed" : ""}
              title={isPaid ? "Paid orders cannot be edited" : "Edit order"}
            />

            {/* Delete Button - Disabled for paid orders */}
            <Button
              variant="danger"
              size="sm"
             
              onClick={() => onDeleteOrder(order._id)}
              text="Delete"
              disabled={isPaid}
              className={isPaid ? "opacity-60 cursor-not-allowed" : ""}
              title={isPaid ? "Paid orders cannot be deleted" : "Delete order"}
            />
          </div>

          {/* Bottom Row - Mark as Paid for unpaid orders only */}
          {!isPaid && (
            <Button
              variant="success"
              size="md"
              icon={<CreditCardIcon className="w-5 h-5" />}
              onClick={() => onMarkAsPaid(order._id)}
              text="Pay Now"
              fullWidth
            />
          )}

          
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
