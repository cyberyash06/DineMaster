import React from 'react';
import { PlusIcon, MinusIcon, TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

const CartSidebar = ({ 
  cart, 
  customerName,
  tableNumber,
  onCustomerNameChange,
  onTableNumberChange,
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  onClearCart 
}) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Enhanced handlers with toast notifications
  const handleUpdateQuantity = (itemId, newQty, itemName) => {
    const oldQty = cart.find(item => item.id === itemId)?.qty || 0;
    onUpdateQuantity(itemId, newQty);
    
    if (newQty > oldQty) {
      toast.success(`Increased ${itemName} quantity to ${newQty}`);
    } else if (newQty < oldQty && newQty > 0) {
      toast.info(`Decreased ${itemName} quantity to ${newQty}`);
    }
  };

  const handleRemoveItem = (itemId, itemName) => {
    onRemoveItem(itemId);
    toast.error(`Removed ${itemName} from cart`);
  };

  const handleClearCart = () => {
    if (cart.length > 0) {
      onClearCart();
      toast.info('Cart cleared');
    }
  };

  const handleCheckout = () => {
    if (!customerName.trim()) {
      toast.error('Customer name is required');
      return;
    }
    if (!tableNumber.trim()) {
      toast.error('Table number is required');
      return;
    }
    if (cart.length === 0) {
      toast.error('Please add items to the order');
      return;
    }

    onCheckout();
    toast.success('Order created successfully!');
  };

  return (
    <div className="w-80 border-l border-slate-200 bg-white shadow-2xl flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <ShoppingCartIcon className="w-5 h-5" />
          Order Cart ({cart.length})
        </h3>
      </div>

      {/* Customer Information - Inline Layout */}
      <div className="flex-shrink-0 p-4 pt-2 border-b border-slate-200 bg-slate-50">
        <h4 className="text-sm font-semibold text-slate-800 mb-3">Customer Information</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => {
                onCustomerNameChange(e.target.value);
              }}
              className="w-full px-2 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Table Number *
            </label>
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => {
                onTableNumberChange(e.target.value);
              }}
              className="w-full px-2 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Table #"
            />
          </div>
        </div>
      </div>

      {/* Cart Items - Scrollable Section */}
      <div className="flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="text-center text-slate-500 mt-12">
            <ShoppingCartIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">Cart is empty</p>
            <p className="text-sm">Add items from the menu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item, index) => (
              <div key={`${item._id}-${index}`} className="bg-slate-50 rounded-xl p-3 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 text-sm">{item.name}</h4>
                    <p className="text-xs text-slate-500">${item.price.toFixed(2)} each</p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id, item.name)}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-all"
                    title="Remove item"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.qty - 1, item.name)}
                      className="w-8 h-8 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center transition-colors text-slate-700 hover:text-slate-900"
                      title="Decrease quantity"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="min-w-[2.5rem] text-center font-semibold text-sm bg-white border border-slate-200 rounded px-2 py-1">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.qty + 1, item.name)}
                      className="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 rounded-full flex items-center justify-center transition-colors"
                      title="Increase quantity"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-blue-600 text-sm">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary and Actions - Always visible when cart has items */}
      <div className="flex-shrink-0 p-2 border-t border-slate-200 bg-slate-50">
        {cart.length > 0 ? (
          <>
            {/* Summary */}
            <div className="space-y-1 mb-2 bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax (8%):</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-300 pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-slate-800">Total:</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                disabled={!customerName.trim() || !tableNumber.trim()}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-md hover:shadow-lg"
                title="Create order with current items"
              >
                Create Order (${total.toFixed(2)})
              </button>
              
              <button
                onClick={handleClearCart}
                className="w-full px-3 py-2 text-sm font-medium text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                title="Clear all items from cart"
              >
                Clear Cart
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-slate-500 py-4">
            <p className="text-sm">Add items to see checkout options</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
