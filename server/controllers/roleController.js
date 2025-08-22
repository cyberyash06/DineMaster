//roleController.js
const RolePermission = require('../models/RolePermission');

// Get all role permissions
exports.getRolePermissions = async (req, res) => {
  const perms = await RolePermission.find();
  res.json(perms);
};

// Update all role permissions (admin only)
exports.updateRolePermissions = async (req, res) => {
  const { permissions } = req.body; // { manager: [], staff: [], cashier: [] }
  for (const role in permissions) {
    await RolePermission.findOneAndUpdate(
      { role },
      { role, pages: permissions[role] },
      { upsert: true, new: true }
    );
  }
  res.json({ message: "Role permissions updated" });
};
