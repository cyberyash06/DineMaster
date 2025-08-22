const express = require('express');
const ctrl = require('../controllers/menuController');
const router = express.Router();

// Category routes
router.get('/', ctrl.getCategories);
router.post('/', ctrl.addCategory);
router.delete('/:id', ctrl.deleteCategory);

module.exports = router;    