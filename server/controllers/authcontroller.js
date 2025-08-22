const bcrypt = require("bcryptjs");
const User = require("../models/user");
const generateToken = require("../utils/generatetoken");

// REGISTER - Only allows admin registration if no admin exists yet
const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile = '1234567890' } = req.body;

    // Check if any admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(403).json({
        message: "Public registration is disabled. Contact your administrator to create an account.",
        error: "REGISTRATION_DISABLED"
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create the first admin user
    const user = await User.create({
      name,
      email,
      password,  // Will be hashed by pre-save middleware
      role: 'admin',
      mobile
      // 🚫 No permissions field!
    });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profilePicture: user.profilePicture,
        mobile: user.mobile
      },
      token: generateToken(user._id, user.role),
      message: "First admin account created successfully! Public registration is now disabled."
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({ message: "Account is inactive. Contact administrator." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profilePicture: user.profilePicture,
        mobile: user.mobile
      },
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// GET PROFILE (Protected route)
const getProfile = async (req, res) => {
  try {
    // Only send account info - no legacy permissions field
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      status: req.user.status,
      profilePicture: req.user.profilePicture,
      mobile: req.user.mobile
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// CHECK REGISTRATION STATUS
const checkRegistrationStatus = async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    res.json({
      registrationEnabled: !adminExists,
      message: adminExists
        ? "Public registration is disabled. Contact administrator to create an account."
        : "Public registration is available for the first admin user."
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ADMIN-ONLY REGISTER USER (for User Management system)
const adminRegisterUser = async (req, res) => {
  try {
    const { name, email, password, role = 'staff', mobile } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password, // Will be hashed by pre-save middleware
      role,
      mobile: mobile || ''
      // 🚫 No permissions!
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "User creation failed", error: error.message });
  }
};


// CHANGE PASSWORD (Protected route)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, req.user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(req.user._id, { password: hashedNewPassword });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// UPDATE PROFILE (Protected route)
const updateProfile = async (req, res) => {
  try {
    const { name, mobile, profilePicture } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (mobile) updateData.mobile = mobile;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// REFRESH TOKEN (Protected route)
const refreshToken = async (req, res) => {
  try {
    const user = req.user;
    const newToken = generateToken(user._id, user.role);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profilePicture: user.profilePicture,
        mobile: user.mobile
      },
      token: newToken
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LOGOUT (Optional)
const logoutUser = async (req, res) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  checkRegistrationStatus,
  adminRegisterUser,
  changePassword,
  updateProfile,
  refreshToken,
  logoutUser
};
