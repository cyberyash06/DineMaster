// components/OrderManagment/EditOrderModal.jsx - Complete version with all state declarations
import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner'; // Add this import
import { getCategories } from '../../lib/api/categoryApi';
import { getMenuItems } from '../../lib/api/menuApi';
import Button from '../ui/Button';

const EditOrderModal = ({ order, onClose, onSave }) => {
  // ✅ ALL REQUIRED STATE DECLARATIONS
  const [formData, setFormData] = useState({
    customerName: '',
    status: 'pending',
    tableNumber: '',
    items: []
  });

  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debug: Log order data when modal opens
  useEffect(() => {
    console.log('🔍 EditOrderModal received order:', order);
    if (order) {
      console.log('📋 Order ID:', order._id);
      console.log('👤 Customer:', order.customerName);
      console.log('🪑 Table:', order.tableNumber);
      console.log('📦 Items:', order.items);
      console.log('💰 Total:', order.total);
      console.log('📊 Status:', order.status);
      console.log('💳 Payment Status:', order.paymentStatus);
    }
  }, [order]);

  // Fetch data when modal opens
  useEffect(() => {
    if (!order) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Fetching categories...');
        
        // Show loading toast
        const loadingToast = toast.loading('Loading menu data...');
        
        const categoriesData = await getCategories()
          .catch(err => {
            console.error('❌ Categories fetch error:', err);
            toast.error('Failed to load categories');
            return [];
          });
        
        console.log('📂 Categories fetched:', categoriesData);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        // Prefill form with order data - Enhanced debugging
        const customerName = order.customerName || order.customer || '';
        const tableNumber = order.tableNumber || order.table || '';
        const status = order.status || 'pending';
        const items = order.items || [];

        console.log('📝 Form data preparation:');
        console.log('  - Customer Name:', customerName);
        console.log('  - Table Number:', tableNumber);
        console.log('  - Status:', status);
        console.log('  - Items count:', items.length);

        setFormData({
          customerName,
          status,
          tableNumber: tableNumber ? String(tableNumber) : '',
          items: items.map(it => {
            console.log('  - Processing item:', it);
            return {
              menuItem: it.menuItem || it.item || {},
              quantity: it.quantity || 1,
              notes: it.notes || ''
            };
          })
        });

        // Reset selections
        setSelectedCategoryId('');
        setFilteredMenuItems([]);
        setSelectedMenuItemId('');

        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success('Order data loaded successfully');

      } catch (error) {
        console.error('❌ Error fetching data:', error);
        setError('Failed to load data. Please check console for details.');
        toast.error('Failed to load order data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [order]);

  // Handle category selection and fetch menu items
  const handleCategoryChange = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    setSelectedMenuItemId('');
    
    if (!categoryId) {
      setFilteredMenuItems([]);
      return;
    }

    try {
      console.log('🍽️ Fetching menu items for category:', categoryId);
      
      // Show loading toast for menu items
      const loadingToast = toast.loading('Loading menu items...');
      
      const items = await getMenuItems(categoryId)
        .catch(err => {
          console.error('❌ Menu items fetch error:', err);
          toast.error('Failed to load menu items for this category');
          return [];
        });
      
      console.log('📋 Menu items fetched:', items);
      setFilteredMenuItems(Array.isArray(items) ? items : []);
      
      // Dismiss loading and show success
      toast.dismiss(loadingToast);
      if (items.length > 0) {
        toast.success(`Loaded ${items.length} menu items`);
      } else {
        toast.info('No items found in this category');
      }
      
    } catch (error) {
      console.error('❌ Error fetching menu items:', error);
      setFilteredMenuItems([]);
      toast.error('Failed to load menu items');
    }
  };

  const addItem = () => {
    if (!selectedMenuItemId) {
      toast.error('Please select an item to add');
      return;
    }

    const menuItem = filteredMenuItems.find(mi => mi._id === selectedMenuItemId);
    if (!menuItem) {
      toast.error('Selected item not found');
      return;
    }
    
    const existing = formData.items.find(it => it.menuItem._id === menuItem._id);
    if (existing) {
      updateItemQuantity(menuItem._id, existing.quantity + 1);
      toast.success(`Increased ${menuItem.name} quantity to ${existing.quantity + 1}`);
    } else {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { menuItem, quantity: 1, notes: '' }]
      }));
      toast.success(`Added ${menuItem.name} to order`);
    }
    
    setSelectedMenuItemId('');
    console.log('✅ Item added:', menuItem.name);
  };

  const updateItemQuantity = (menuItemId, qty) => {
    if (qty <= 0) return removeItem(menuItemId);
    
    const item = formData.items.find(it => it.menuItem._id === menuItemId);
    if (item) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map(it =>
          it.menuItem._id === menuItemId ? { ...it, quantity: qty } : it
        )
      }));
      toast.success(`Updated ${item.menuItem.name} quantity to ${qty}`);
    }
  };

  const removeItem = menuItemId => {
    const item = formData.items.find(it => it.menuItem._id === menuItemId);
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(it => it.menuItem._id !== menuItemId)
    }));
    if (item) {
      toast.success(`Removed ${item.menuItem.name} from order`);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('💾 Attempting to save order with data:', formData);
    
    // Enhanced validation with toasts
    if (!formData.customerName.trim()) {
      toast.error('Customer name is required');
      return;
    }
    if (!formData.tableNumber.trim()) {
      toast.error('Table number is required');
      return;
    }
    
    const tableNum = parseInt(formData.tableNumber);
    if (isNaN(tableNum) || tableNum <= 0) {
      toast.error('Please enter a valid table number');
      return;
    }
    
    if (formData.items.length === 0) {
      toast.error('Please add at least one item to the order');
      return;
    }

    // Show saving toast
    const savingToast = toast.loading('Saving order changes...');

    // Calculate total
    const subtotal = formData.items.reduce(
      (sum, it) => sum + (it.menuItem.price || 0) * it.quantity, 0
    );
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const updatedOrder = {
      ...order,
      customerName: formData.customerName.trim(),
      status: formData.status,
      tableNumber: tableNum,
      total: total,
      items: formData.items.map(it => ({
        menuItem: it.menuItem._id,
        quantity: it.quantity,
        notes: it.notes || ''
      }))
    };
    
    console.log('📤 Sending updated order:', updatedOrder);
    
    try {
      onSave(updatedOrder);
      toast.dismiss(savingToast);
      toast.success('Order updated successfully!');
    } catch (error) {
      toast.dismiss(savingToast);
      toast.error('Failed to save order changes');
    }
  };

  // Don't render if no order
  if (!order) {
    console.log('⚠️ EditOrderModal: No order provided');
    return null;
  }

  // Calculate totals
  const subtotal = formData.items.reduce(
    (sum, it) => sum + (it.menuItem.price || 0) * it.quantity, 0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  console.log('💰 Calculated totals:', { subtotal, tax, total });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Edit Order</h2>
              <p className="text-blue-100">#{order._id ? order._id.slice(-4) : 'Unknown'}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<XMarkIcon className="w-6 h-6" />}
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 border-none text-white p-2"
            />
          </div>
        </div>

        <div className="p-6">
          {/* Debug Info (Remove in production) */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <h4 className="font-semibold text-blue-800 mb-1">Debug Info:</h4>
            <p><strong>Order ID:</strong> {order._id || 'Missing'}</p>
            <p><strong>Customer:</strong> {formData.customerName || 'Not loaded'}</p>
            <p><strong>Table:</strong> {formData.tableNumber || 'Not loaded'}</p>
            <p><strong>Items:</strong> {formData.items.length} items loaded</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-slate-600">Loading...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Order Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter customer name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Table Number *
                    </label>
                    <input
                      type="number"
                      name="tableNumber"
                      value={formData.tableNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter table number"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Order Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="served">Served</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Current Items */}
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-slate-800 mb-3">
                    Current Items ({formData.items.length})
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    {formData.items.length === 0 ? (
                      <p className="text-slate-500 text-center py-4">No items in order</p>
                    ) : (
                      <div className="space-y-3">
                        {formData.items.map((it, index) => (
                          <div key={it.menuItem._id || index} className="flex items-center justify-between bg-white rounded-lg p-3">
                            <div>
                              <p className="font-medium text-slate-800">
                                {it.menuItem.name || 'Unknown Item'}
                              </p>
                              <p className="text-sm text-slate-500">
                                ₹{it.menuItem.price?.toFixed(2) || '0.00'} each
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                icon={<MinusIcon className="w-4 h-4" />}
                                onClick={() => updateItemQuantity(it.menuItem._id, it.quantity - 1)}
                                className="w-8 h-8 p-0 min-w-0"
                              />
                              <span className="w-8 text-center font-medium">{it.quantity}</span>
                              <Button
                                variant="primary"
                                size="sm"
                                icon={<PlusIcon className="w-4 h-4" />}
                                onClick={() => updateItemQuantity(it.menuItem._id, it.quantity + 1)}
                                className="w-8 h-8 p-0 min-w-0"
                              />
                              <Button
                                variant="danger"
                                size="sm"
                                icon={<TrashIcon className="w-4 h-4" />}
                                onClick={() => removeItem(it.menuItem._id)}
                                className="w-8 h-8 p-0 min-w-0 ml-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Items + Summary */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Item</h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Select Category ({categories.length} available)
                    </label>
                    <select
                      value={selectedCategoryId}
                      onChange={e => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Choose a category</option>
                      {categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Select Menu Item ({filteredMenuItems.length} available)
                    </label>
                    <select
                      value={selectedMenuItemId}
                      onChange={e => setSelectedMenuItemId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={!selectedCategoryId}
                    >
                      <option value="">
                        {!selectedCategoryId ? 'Select a category first' : 'Choose an item'}
                      </option>
                      {filteredMenuItems.map(m => (
                        <option key={m._id} value={m._id}>
                          {m.name} — ₹{m.price?.toFixed(2) || '0.00'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    icon={<PlusIcon className="w-4 h-4" />}
                    onClick={addItem}
                    disabled={!selectedMenuItemId}
                    text="Add to Order"
                    fullWidth
                  />
                </div>

                {/* Order Summary */}
                <div className="mt-6 bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%):</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-300 pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-blue-600">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
            <Button
              variant="secondary"
              size="lg"
              text="Cancel"
              onClick={onClose}
              className="flex-1"
            />
            <Button
              variant="primary"
              size="lg"
              text="Save Changes"
              onClick={handleSave}
              className="flex-1"
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;
