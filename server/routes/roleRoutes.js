const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { protect, authorize } = require('../middleware/authmiddleware');

// Only admins can view and update role-permissions
router.get('/', protect, authorize('admin'), roleController.getRolePermissions);
router.put('/', protect, authorize('admin'), roleController.updateRolePermissions);

module.exports = router;
