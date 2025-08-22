// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authmiddleware');

router.get('/summary', protect, dashboardController.getDashboardSummary);
router.get('/sales-trends', protect, dashboardController.getSalesTrends);
router.get('/top-selling', protect, dashboardController.getTopSellingItems);
router.get('/user-roles', protect, dashboardController.getUserRolesDistribution);
router.get('/recent-activities', protect, dashboardController.getRecentActivities);

module.exports = router;
