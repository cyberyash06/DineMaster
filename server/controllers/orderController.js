// controllers/orderController.js - Enhanced version with auto-serve logic
const Order = require('../models/order');

// Get all orders (with menu item details populated)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('items.menuItem', 'name price category');
    
    console.log(`📦 Fetched ${orders.length} orders`);
    res.json(orders);
  } catch (err) {
    console.error('❌ Error fetching orders:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create a new order - Enhanced with better validation
exports.createOrder = async (req, res) => {
  try {
    console.log('📝 Creating order with data:', req.body);
    
    const { 
      customerName, 
      tableNumber, 
      items, 
      total, 
      status = 'pending',
      paymentStatus = 'Unpaid' 
    } = req.body;

    // Enhanced validation
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ message: 'Customer name is required' });
    }
    
    if (!tableNumber || isNaN(parseInt(tableNumber)) || parseInt(tableNumber) <= 0) {
      return res.status(400).json({ message: 'Valid table number is required (must be positive)' });
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required' });
    }

    // Validate each item in the order
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.menuItem || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ 
          message: `Invalid item at position ${i + 1}. Menu item and positive quantity are required.` 
        });
      }
    }
    
    if (!total || isNaN(parseFloat(total)) || parseFloat(total) <= 0) {
      return res.status(400).json({ message: 'Valid total amount is required (must be positive)' });
    }

    // Create order with all required fields
    const order = new Order({
      customerName: customerName.trim(),
      tableNumber: parseInt(tableNumber),
      items,
      total: parseFloat(total),
      status,
      paymentStatus,
      table: `Table ${tableNumber}` // For backward compatibility
    });

    const saved = await order.save();
    const populated = await saved.populate('items.menuItem', 'name price category');
    
    console.log('✅ Order created successfully:', populated._id);
    console.log(`📊 Order details: Customer: ${populated.customerName}, Table: ${populated.tableNumber}, Items: ${populated.items.length}, Total: ₹${populated.total}`);
    
    res.status(201).json(populated);
  } catch (err) {
    console.error('❌ Order creation error:', err);
    
    // Handle validation errors specifically
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate order detected', 
        error: 'This order already exists' 
      });
    }
    
    res.status(400).json({ message: 'Order creation failed', error: err.message });
  }
};

// Update an order (status or other fields) - Enhanced with auto-serve logic
exports.updateOrder = async (req, res) => {
  try {
    console.log('📝 Updating order:', req.params.id, 'with data:', req.body);
    
    const { customerName, tableNumber, items, status, paymentStatus } = req.body;
    
    let updateData = { ...req.body };
    
    // AUTO-SERVE LOGIC: If payment status is being set to 'Paid', also set status to 'served'
    if (paymentStatus === 'Paid') {
      updateData.status = 'served';
      console.log('🎯 Auto-setting status to "served" because payment is marked as "Paid"');
    }
    
    // Enhanced field processing
    if (customerName) {
      updateData.customerName = customerName.trim();
    }
    
    if (tableNumber) {
      const parsedTableNumber = parseInt(tableNumber);
      if (isNaN(parsedTableNumber) || parsedTableNumber <= 0) {
        return res.status(400).json({ message: 'Valid table number is required (must be positive)' });
      }
      updateData.tableNumber = parsedTableNumber;
      updateData.table = `Table ${parsedTableNumber}`; // Update legacy field too
    }

    // Validate items if they're being updated
    if (items && Array.isArray(items)) {
      if (items.length === 0) {
        return res.status(400).json({ message: 'At least one item is required' });
      }
      
      // Validate each item
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.menuItem || !item.quantity || item.quantity <= 0) {
          return res.status(400).json({ 
            message: `Invalid item at position ${i + 1}. Menu item and positive quantity are required.` 
          });
        }
      }
      updateData.items = items;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('items.menuItem', 'name price category');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    console.log('✅ Order updated successfully:', order._id);
    console.log('📊 Final order status:', order.status);
    console.log('💰 Final payment status:', order.paymentStatus);
    
    res.json(order);
  } catch (err) {
    console.error('❌ Order update error:', err);
    
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
    
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

// Mark an order as paid - Enhanced with auto-serve and better logging
exports.markOrderAsPaid = async (req, res) => {
  try {
    console.log('💳 Marking order as paid and served:', req.params.id);
    
    // First check if order exists and get current status
    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if already paid
    if (existingOrder.paymentStatus === 'Paid') {
      console.log('⚠️ Order is already marked as paid');
      return res.status(400).json({ 
        message: 'Order is already marked as paid',
        currentStatus: existingOrder.status,
        paymentStatus: existingOrder.paymentStatus
      });
    }

    // Update both payment status and order status
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        paymentStatus: 'Paid',
        status: 'served' // Auto-serve when paid
      },
      { new: true, runValidators: true }
    ).populate('items.menuItem', 'name price category');
    
    console.log('✅ Order marked as paid and served in DATABASE:', order._id);
    console.log('📊 Updated order status:', order.status); // Should log "served"
    console.log('💰 Updated payment status:', order.paymentStatus); // Should log "Paid"
    console.log(`💵 Order total: ₹${order.total} - Customer: ${order.customerName} - Table: ${order.tableNumber}`);
    
    res.json(order);
  } catch (err) {
    console.error('❌ Error marking order as paid:', err);
    res.status(400).json({ message: 'Failed to mark as paid', error: err.message });
  }
};

// Delete an order - Enhanced with better validation and logging
exports.deleteOrder = async (req, res) => {
  try {
    console.log('🗑️ Attempting to delete order:', req.params.id);
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    console.log(`📋 Order details before deletion: Customer: ${order.customerName}, Status: ${order.status}, Payment: ${order.paymentStatus}`);
    
    // Enhanced business logic validation
    if (order.paymentStatus === 'Paid') {
      console.log('⚠️ Attempted to delete paid order - BLOCKED');
      return res.status(400).json({ 
        message: 'Cannot delete paid orders. Paid orders must be preserved for accounting purposes.',
        orderId: order._id,
        customerName: order.customerName,
        tableNumber: order.tableNumber,
        total: order.total
      });
    }

    // Additional protection for served orders (even if not paid)
    if (order.status === 'served') {
      console.log('⚠️ Attempted to delete served order - BLOCKED');
      return res.status(400).json({ 
        message: 'Cannot delete served orders. Please contact administrator if deletion is necessary.',
        orderId: order._id,
        customerName: order.customerName,
        tableNumber: order.tableNumber
      });
    }
    
    await Order.findByIdAndDelete(req.params.id);
    
    console.log('✅ Order deleted successfully:', req.params.id);
    console.log(`📋 Deleted order: Customer: ${order.customerName}, Table: ${order.tableNumber}, Total: ₹${order.total}`);
    
    res.json({ 
      message: 'Order deleted successfully',
      deletedOrder: {
        id: order._id,
        customerName: order.customerName,
        tableNumber: order.tableNumber,
        total: order.total,
        status: order.status
      }
    });
  } catch (err) {
    console.error('❌ Error deleting order:', err);
    res.status(400).json({ message: 'Delete failed', error: err.message });
  }
};

// Bonus: Get order statistics (optional enhancement)
exports.getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = await Order.aggregate([
      {
        $facet: {
          todayStats: [
            {
              $match: {
                createdAt: { $gte: today, $lt: tomorrow }
              }
            },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$total' },
                avgOrderValue: { $avg: '$total' }
              }
            }
          ],
          statusStats: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          paymentStats: [
            {
              $group: {
                _id: '$paymentStatus',
                count: { $sum: 1 },
                totalAmount: { $sum: '$total' }
              }
            }
          ]
        }
      }
    ]);

    res.json(stats[0]);
  } catch (err) {
    console.error('❌ Error fetching order stats:', err);
    res.status(500).json({ message: 'Failed to fetch statistics', error: err.message });
  }
};
