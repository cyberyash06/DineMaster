// models/Order.js - Updated schema
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, default: 1, required: true },
      notes: String
    }
  ],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: [, 'preparing', 'ready', 'served', 'completed'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Paid', 'Unpaid'], 
    default: 'Unpaid' 
  }, // ADD THIS FIELD
  customerName: { type: String, required: true }, // ADD THIS
  tableNumber: { type: Number, required: true }, // ADD THIS
  table: { type: String },  // Keep for backward compatibility
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
