// components/OrderManagment/NewOrderModal.jsx - Minor improvements
import React, { useState, useEffect } from 'react';
import { XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import MenuPanel from './MenuPanel';
import CartSidebar from './CartSidebar';
import { getCategories as fetchCategories } from '../../lib/api/categoryApi';
import { getMenuItems } from '../../lib/api/menuApi';

const STORAGE_KEY = 'activeOrderCartV1';

const NewOrderModal = ({ isOpen, onClose, onSave }) => {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [showCart, setShowCart] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  // Restore saved cart on modal open
  useEffect(() => {
    if (!isOpen) return;
    const persisted = localStorage.getItem(STORAGE_KEY);
    if (persisted) {
      try {
        const parsed = JSON.parse(persisted);
        setCart(parsed.cart || []);
        setCustomerName(parsed.customerName || '');
        setTableNumber(parsed.tableNumber || '');
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }
  }, [isOpen]);

  // Save cart on changes
  useEffect(() => {
    if (!isOpen) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, customerName, tableNumber }));
  }, [cart, customerName, tableNumber, isOpen]);

  // Fetch categories when opened
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchCategoriesData = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
        setSelectedCategory(cats?.[0] || null);
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Error loading categories');
      }
    };
    
    fetchCategoriesData();
  }, [isOpen]);

  // Fetch menu items when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setMenuItems([]);
      setLoadingMenu(false);
      return;
    }
    
    const fetchMenuData = async () => {
      setLoadingMenu(true);
      try {
        const items = await getMenuItems(selectedCategory._id || selectedCategory.id);
        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setMenuItems([]);
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchMenuData();
  }, [selectedCategory]);

  const addToCart = (item) => {
    setCart(prev => {
      const found = prev.find(ci => ci._id === item._id);
      if (found) {
        return prev.map(ci => ci._id === item._id ? { ...ci, qty: ci.qty + 1 } : ci);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateCartQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(prev =>
        prev.map(it => it._id === itemId ? { ...it, qty: newQty } : it)
      );
    }
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(it => it._id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setTableNumber('');
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleClose = () => {
    clearCart();
    setShowCart(false);
    onClose();
  };

  const handleCheckout = () => {
    // Validation
    if (!customerName.trim()) {
      alert('Customer name is required');
      return;
    }
    if (!tableNumber.trim()) {
      alert('Table number is required');
      return;
    }
    if (cart.length === 0) {
      alert('Please add items to the order');
      return;
    }

    const subtotal = cart.reduce((sum, it) => sum + (it.price || 0) * it.qty, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const orderData = {
      customerName: customerName.trim(),
      tableNumber: parseInt(tableNumber),
      items: cart.map(({ _id, qty, notes }) => ({
        menuItem: _id,
        quantity: qty,
        notes: notes || ''
      })),
      total: total,
      status: 'pending',
      paymentStatus: 'Unpaid'
    };
    
    onSave(orderData);
    clearCart();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create New Order</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200"
                title="Toggle Cart"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cart.reduce((sum, item) => sum + item.qty, 0)}
                  </span>
                )}
              </button>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Menu Panel */}
          <div className={`${showCart ? 'flex-1' : 'w-full'} overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50`}>
            <MenuPanel
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              items={menuItems}
              loading={loadingMenu}
              onAddToCart={addToCart}
            />
          </div>
          
          {/* Cart Sidebar */}
          {showCart && (
            <CartSidebar
              cart={cart}
              customerName={customerName}
              tableNumber={tableNumber}
              onCustomerNameChange={setCustomerName}
              onTableNumberChange={setTableNumber}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeFromCart}
              onCheckout={handleCheckout}
              onClearCart={clearCart}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewOrderModal;
