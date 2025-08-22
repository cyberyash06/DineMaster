const express = require('express');
const {
  registerUser,
  loginUser,
  getProfile,
  checkRegistrationStatus,
  adminRegisterUser,
  changePassword,
  updateProfile,
  refreshToken,
  logoutUser
} = require('../controllers/authcontroller');
const { protect, authorize } = require('../middleware/authmiddleware');
const router = express.Router();

// Public routes
router.post('/register', registerUser); // Checks if admin exists before allowing registration
router.post('/login', loginUser);
router.get('/registration-status', checkRegistrationStatus); // Check if registration is enabled

// Protected routes
router.get('/me', protect, getProfile);
router.post('/change-password', protect, changePassword);
router.put('/profile', protect, updateProfile);
router.post('/refresh', protect, refreshToken);
router.post('/logout', protect, logoutUser);

// Admin-only routes (for User Management system)
router.post('/admin/register-user', protect, authorize('admin'), adminRegisterUser);

module.exports = router;
