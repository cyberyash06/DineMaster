const express = require('express');
const ctrl = require('../controllers/menuController');
const router = express.Router();



// Menu item routes
router.get('/', ctrl.getMenuItems);
router.post('/', ctrl.addMenuItem);
router.patch('/:id', ctrl.updateMenuItem);
router.delete('/:id', ctrl.deleteMenuItem);
router.patch('/:id/availability', ctrl.toggleItemAvailability);

module.exports = router;
