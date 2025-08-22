//authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const RolePermission = require("../models/RolePermission"); // import your role permission model

// Protect routes - set req.user
const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User does not exist" });
      }
      if (req.user.status !== "active") {
        return res.status(403).json({ message: "Account is inactive" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Permission-based middleware - checks via RolePermission model (not per user)
const hasPermission = (resource, action) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Admin has all permissions by default
    if (req.user.role === "admin") {
      return next();
    }

    // --- CENTRALIZED LOOKUP: check RolePermission ---
    const rolePerm = await RolePermission.findOne({ role: req.user.role });
    if (!rolePerm) {
      return res.status(403).json({ message: "Role permissions not set. Contact admin." });
    }

    // Example: rolePerm.pages = ['orders', 'menu', ...]
    // If you want to check page-level only:
    if (!rolePerm.pages.includes(resource)) {
      return res.status(403).json({
        message: `Access denied. ${req.user.role} cannot access ${resource}`
      });
    }

    // If you want fine action-based control, extend your RolePermission model to store actions per page (for now, assume page-level)
    // So: if "/orders" page is permitted, any action allowed -- or you can do more granular logic here.

    next();
  };
};

// Pure role-based, as before
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}`
      });
    }
    next();
  };
};

// Classic admin-only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

module.exports = { protect, authorize, hasPermission, adminOnly };
