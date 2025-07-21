const express = require('express');
const {
  registerUser,
  loginUser,
  getProfile,
} = require('../controllers/authcontroller');
const { protect, adminOnly } = require('../middleware/authmiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login',    loginUser);
router.get ('/me',       protect, getProfile);  


// Example of an admin-only route

router.get('/admin-only', protect, adminOnly, (req, res) => {
  res.send("Welcome Admin!");
});

module.exports = router;
