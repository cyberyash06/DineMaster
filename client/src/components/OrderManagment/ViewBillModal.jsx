// components/OrderManagment/ViewBillModal.jsx 
import React from 'react';
import { XMarkIcon, PrinterIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const ViewBillModal = ({ order, onClose, onMarkAsPaid }) => {
  if (!order) return null;

  const subtotal = order.items.reduce(
    (sum, it) => sum + (it.menuItem?.price || 0) * (it.quantity || 0), 0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const isPaid = order.paymentStatus === 'Paid';
  
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

  const handlePrint = () => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 24px; margin: 0; color: #1e293b;">Restaurant Bill</h1>
          <p style="margin: 5px 0; color: #64748b;">Thank you for dining with us!</p>
        </div>
        
        <div style="border-bottom: 2px dashed #cbd5e1; padding-bottom: 15px; margin-bottom: 15px;">
          <p><strong>Order ID:</strong> ${order._id.slice(-4)}</p>
          <p><strong>Customer:</strong> ${order.customerName || 'Walk-in Customer'}</p>
          <p><strong>Table:</strong> ${order.tableNumber || 'N/A'}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="margin-bottom: 10px; color: #1e293b;">Items Ordered</h3>
          ${order.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px dotted #ccc; padding-bottom: 4px;">
              <span>${item.quantity}x ${item.menuItem?.name || 'Unknown Item'}</span>
              <span>₹${((item.menuItem?.price || 0) * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        
        <div style="border-top: 2px dashed #cbd5e1; padding-top: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Subtotal:</span>
            <span>₹${subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Tax (8%):</span>
            <span>₹${tax.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-top: 10px; color: #1e293b; border-top: 1px solid #000; padding-top: 5px;">
            <span>Total:</span>
            <span>₹${total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 items-end">
            <StatusBadge status={order.status} />
            <PaymentBadge status={order.paymentStatus || 'Unpaid'} />
          </div>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Bill - ${order._id.slice(-4)}</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: Arial, sans-serif;
              }
              @media print { 
                body { margin: 0; }
                @page { margin: 0.5in; }
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert('Please allow popups to print the bill');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Order Bill</h2>
              <p className="text-blue-100">#{order._id.slice(-4)}</p>
              {/* Add completion indicator for paid orders */}
              {isPaid && (
                <div className="flex items-center gap-1 mt-1">
                  <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-300 text-sm font-medium">Completed</span>
                </div>
              )}
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

        {/* Bill Content */}
        <div className="p-6">
          {/* Order Info */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500 font-medium">Customer</p>
                <p className="font-semibold text-slate-800">{order.customerName || 'Walk-in Customer'}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Table</p>
                <p className="font-semibold text-slate-800">{order.tableNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Date & Time</p>
                <p className="font-semibold text-slate-800 text-xs">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Status</p>
                <div className="flex flex-col gap-1">
                
                  <span className={`px-2 py-1 rounded text-xs font-semibold w-fit ${
                    order.status === 'served' 
                      ? 'bg-green-100 text-green-800' 
                      : order.status === 'ready'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.status === 'preparing'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold w-fit ${
                    order.paymentStatus === 'Paid' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.paymentStatus || 'Unpaid'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-800 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                  <div>
                    <p className="font-medium text-slate-800">{item.menuItem?.name || 'Unknown Item'}</p>
                    <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                    {item.notes && (
                      <p className="text-xs text-slate-400 italic">Note: {item.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">
                      ₹{((item.menuItem?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">
                      ₹{item.menuItem?.price?.toFixed(2) || '0.00'} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax (8%):</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-300 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-800">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Completion Status for Paid Orders */}
          {isPaid && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-green-800">Order Completed & Served</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Payment received and order has been served to the customer.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              icon={<PrinterIcon className="w-5 h-5" />}
              onClick={handlePrint}
              text="Print Bill"
              className="flex-1"
            />
            
            {/* Mark as Paid button - only show for unpaid orders */}
            {!isPaid && onMarkAsPaid && (
              <Button
                variant="success"
                size="lg"
                icon={<CreditCardIcon className="w-5 h-5" />}
                onClick={() => onMarkAsPaid(order)}
                text="Mark as Paid"
                className="flex-1"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBillModal;
