import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const OrdersContext = createContext();

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      table: 5,
      customer: 'John Doe',
      timestamp: '2:30 PM',
      status: 'Pending',
      paid: false,
      items: [
        { name: 'Caesar Salad', qty: 2, price: 12.99 },
        { name: 'Grilled Steak', qty: 1, price: 28.99 },
        { name: 'Chocolate Cake', qty: 1, price: 9.99 }
      ]
    },
    {
      id: 'ORD-002',
      table: 3,
      customer: 'Jane Smith',
      timestamp: '2:45 PM',
      status: 'In-Progress',
      paid: false,
      items: [
        { name: 'Pasta Carbonara', qty: 1, price: 18.99 },
        { name: 'Garlic Bread', qty: 2, price: 8.99 }
      ]
    },
    {
      id: 'ORD-003',
      table: 8,
      customer: 'Mike Wilson',
      timestamp: '3:00 PM',
      status: 'Completed',
      paid: true,
      items: [
        { name: 'Caesar Salad', qty: 1, price: 12.99 },
        { name: 'Chocolate Cake', qty: 2, price: 9.99 }
      ]
    }
  ]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  const markOrderAsPaid = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, paid: true, status: 'Paid' } : order
    ));
    toast.success(`Order ${orderId} marked as paid`);
  };

  const addOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending',
      paid: false,
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);
    toast.success('New order created successfully');
  };

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate status updates
      setOrders(prev => prev.map(order => {
        if (Math.random() < 0.1 && order.status === 'Pending') {
          return { ...order, status: 'In-Progress' };
        }
        if (Math.random() < 0.05 && order.status === 'In-Progress') {
          return { ...order, status: 'Completed' };
        }
        return order;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <OrdersContext.Provider value={{
      orders,
      updateOrderStatus,
      markOrderAsPaid,
      addOrder
    }}>
      {children}
    </OrdersContext.Provider>
  );
};
