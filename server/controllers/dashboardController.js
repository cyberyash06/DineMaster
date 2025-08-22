// controllers/dashboardController.js - Fixed version
const Order = require('../models/order');
const User = require('../models/user');
const Menu = require('../models/menu_item'); // Note: lowercase 'user' based on your previous files

// Get dashboard summary
exports.getDashboardSummary = async (req, res) => {
  try {
    console.log('🔍 Fetching dashboard summary...');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Basic counts with error handling
    const todaysOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
      status: { $ne: 'cancelled' }
    }).catch(err => {
      console.log('Error counting today orders:', err);
      return 0;
    });

    // Revenue calculation with error handling
    const revenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          status: 'served'
        }
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]).catch(err => {
      console.log('Error calculating revenue:', err);
      return [{ total: 0 }];
    });

    const todaysRevenue = revenueResult[0]?.total || 0;

    // Simple counts for other metrics
    const activeReservations = await Order.countDocuments({
      status: 'ready'
    }).catch(() => 0);

    const pendingBills = await Order.countDocuments({
      status: { $in: ['pending', 'preparing'] }
    }).catch(() => 0);

    const result = {
      todaysOrders,
      todaysRevenue,
      activeReservations,
      pendingBills,
      trends: {
        orders: { direction: 'up', percentage: '0' },
        revenue: { direction: 'up', percentage: '0' }
      }
    };

    console.log('📊 Dashboard summary result:', result);
    res.json(result);
  } catch (error) {
    console.error('❌ Dashboard summary error:', error);
    res.status(500).json({ 
      message: 'Dashboard summary failed', 
      error: error.message,
      stack: error.stack 
    });
  }
};

// Get sales trends - Simplified version
exports.getSalesTrends = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: 'served'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).catch(err => {
      console.log('Sales trends error:', err);
      return [];
    });

    res.json(salesData);
  } catch (error) {
    console.error('❌ Sales trends error:', error);
    res.status(500).json({ message: 'Sales trends failed', error: error.message });
  }
};

// Get top selling items - Simplified without lookup initially
exports.getTopSellingItems = async (req, res) => {
  try {
    // Simple version without complex lookups
    const topItems = await Order.aggregate([
      { $match: { status: 'served' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          quantity: { $sum: '$items.quantity' },
          name: { $first: 'Menu Item' } // Placeholder name
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 }
    ]).catch(err => {
      console.log('Top items error:', err);
      return [];
    });

    res.json(topItems);
  } catch (error) {
    console.error('❌ Top selling items error:', error);
    res.status(500).json({ message: 'Top items failed', error: error.message });
  }
};

// Get user roles distribution
exports.getUserRolesDistribution = async (req, res) => {
  try {
    const rolesData = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]).catch(err => {
      console.log('User roles error:', err);
      return [];
    });

    res.json(rolesData);
  } catch (error) {
    console.error('❌ User roles error:', error);
    res.status(500).json({ message: 'User roles failed', error: error.message });
  }
};

// Get recent activities - Simplified version
exports.getRecentActivities = async (req, res) => {
  try {
    // Get recent orders only (simplified)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('_id status total createdAt table')
      .catch(err => {
        console.log('Recent orders error:', err);
        return [];
      });

    const activities = [];

    // Add order activities
    recentOrders.forEach((order, index) => {
      activities.push({
        id: order._id,
        type: 'order',
        title: `Order #${index + 1}`,
        description: `${order.status} - ₹${order.total}`,
        user: order.table || 'Walk-in',
        timestamp: order.createdAt,
        icon: 'order'
      });
    });

    res.json(activities);
  } catch (error) {
    console.error('❌ Recent activities error:', error);
    res.status(500).json({ message: 'Recent activities failed', error: error.message });
  }
};
