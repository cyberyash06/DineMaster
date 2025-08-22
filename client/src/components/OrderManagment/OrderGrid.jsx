import React from 'react';
import OrderCard from './OrderCard';

const OrderGrid = ({ orders, onViewBill, onEditOrder, onDeleteOrder,onMarkAsPaid }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-slate-600 mb-2">No orders found</h3>
        <p className="text-slate-500">Orders matching your filters will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {orders.map(order => (
        <OrderCard
          key={order._id}
          order={order}
          onViewBill={onViewBill}
          onEditOrder={onEditOrder}
          onDeleteOrder={onDeleteOrder}
          onMarkAsPaid={onMarkAsPaid}
        />
      ))}
    </div>
  );
};

export default OrderGrid;
