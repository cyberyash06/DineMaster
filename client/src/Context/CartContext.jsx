import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import { useOrders } from './OrdersContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const { addOrder } = useOrders();

  const addToCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const updateQuantity = (item, newQty) => {
    if (newQty <= 0) {
      removeFromCart(item);
      return;
    }
    setCart(prev => prev.map(cartItem =>
      cartItem.id === item.id
        ? { ...cartItem, qty: newQty }
        : cartItem
    ));
  };

  const removeFromCart = (item) => {
    setCart(prev => prev.filter(cartItem => cartItem.id !== item.id));
    toast.success(`${item.name} removed from cart`);
  };

  const clearCart = () => {
    setCart([]);
    setTableNumber('');
    setCustomerName('');
  };

  const checkout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    if (!tableNumber) {
      toast.error('Please enter table number');
      return;
    }

    const orderData = {
      table: parseInt(tableNumber),
      customer: customerName || `Table ${tableNumber}`,
      items: cart.map(item => ({
        name: item.name,
        qty: item.qty,
        price: item.price
      }))
    };

    addOrder(orderData);
    clearCart();
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <CartContext.Provider value={{
      cart,
      tableNumber,
      customerName,
      setTableNumber,
      setCustomerName,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      checkout,
      subtotal,
      tax,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};

