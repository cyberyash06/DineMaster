// routes/orders.js
const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/orderController');

// Get all orders
router.get('/', ctrl.getOrders);

// Create a new order
router.post('/', ctrl.createOrder);

// Update (patch) an order by ID
router.patch('/:id', ctrl.updateOrder);

// Mark as paid endpoint (PATCH /api/orders/:id/pay)
router.patch('/:id/pay', ctrl.markOrderAsPaid);


// Delete an order by ID
router.delete('/:id', ctrl.deleteOrder);

module.exports = router;
