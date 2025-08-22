const mongoose = require('mongoose');
const RolePermissionSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  pages: [String] // e.g. ['dashboard','orders','billing']
});
module.exports = mongoose.models.RolePermission || mongoose.model('RolePermission', RolePermissionSchema);
