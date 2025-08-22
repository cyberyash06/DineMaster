import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import OrderHeader from '../components/OrderManagment/OrderHeader';
import OrderFilters from '../components/OrderManagment/OrderFilter';
import OrderGrid from '../components/OrderManagment/OrderGrid';
import ViewBillModal from '../components/OrderManagment/ViewBillModal';
import EditOrderModal from '../components/OrderManagment/EditOrderModal';
import NewOrderModal from '../components/OrderManagment/NewOrderModal';
import {useAuth} from '../Context/AuthContext';
import {
  getOrders, addOrder, updateOrder, deleteOrder,
  markOrderAsPaid
} from '../lib/api/orderApi'; // You must implement markOrderAsPaid (shortcut patch)

const OrderManagement = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingOrder, setViewingOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // ⏬ Fetch orders from backend on mount/change
  useEffect(() => {
    setLoading(true);
    getOrders()
      .then(setOrders)
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  // Filtering logic (unchanged)
  const filteredOrders = orders.filter(order => {
    const statusMatch = statusFilter === 'All' || order.status === statusFilter;
    const paymentMatch = paymentFilter === 'All' || order.paymentStatus === paymentFilter;
    const searchMatch = searchTerm === '' ||
      (order.tableNumber?.toString()?.includes(searchTerm)) ||
      (order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order._id?.toLowerCase().includes(searchTerm.toLowerCase()));
    return statusMatch && paymentMatch && searchMatch;
  });

  // ➕ Create new order (POST /api/orders)
  const handleCreateOrder = async (orderData) => {
    try {
      const created = await addOrder(orderData);
      setOrders(prev => [created, ...prev]);
      setShowNewOrderModal(false);
      toast.success('New order created successfully');
    } catch {
      toast.error('Failed to create order');
    }
  };

  // 🟢 Update order (PUT/PATCH /api/orders/:id)
  const handleUpdateOrder = async (updatedOrder) => {
    try {
      const updated = await updateOrder(updatedOrder._id, updatedOrder);
      setOrders(prev => prev.map(order => order._id === updated._id ? updated : order));
      setEditingOrder(null);
      toast.success('Order updated successfully');
    } catch {
      toast.error('Failed to update order');
    }
  };

  // 🟤 Mark as Paid (PATCH /api/orders/:id)
  const handleMarkAsPaid = async (orderId) => {
    try {
      // Backend should support updating paymentStatus via PATCH
      const updated = await markOrderAsPaid(orderId);
      setOrders(prev => prev.map(order => order._id === updated._id ? updated : order));
      toast.success('Order marked as paid');
    } catch {
      toast.error('Failed to mark order as paid');
    }
  };

  // ❌ Delete order (DELETE /api/orders/:id)
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(order => order._id !== orderId));
      toast.success('Order deleted successfully');
    } catch {
      toast.error('Failed to delete order');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <OrderHeader
        user={user}
        onNewOrder={() => setShowNewOrderModal(true)}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <OrderFilters
          statusFilter={statusFilter}
          paymentFilter={paymentFilter}
          searchTerm={searchTerm}
          onStatusFilterChange={setStatusFilter}
          onPaymentFilterChange={setPaymentFilter}
          onSearchChange={setSearchTerm}
          totalOrders={orders.length}
          filteredCount={filteredOrders.length}
        />

        <OrderGrid
          orders={filteredOrders}
          onViewBill={setViewingOrder}
          onEditOrder={setEditingOrder}
          onDeleteOrder={handleDeleteOrder}
          onMarkAsPaid={handleMarkAsPaid}
        />
      </div>

      {/* Modals */}
      <ViewBillModal
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
        onMarkAsPaid={o => handleMarkAsPaid(o?._id)}
      />

      <EditOrderModal
        order={editingOrder}
        onClose={() => setEditingOrder(null)}
        onSave={handleUpdateOrder}
      />

      <NewOrderModal
        isOpen={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
        onSave={handleCreateOrder}
      />
    </div>
  );
};

export default OrderManagement;
