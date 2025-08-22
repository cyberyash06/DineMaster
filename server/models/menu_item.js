// models/MenuItem.js
const mongoose = require('mongoose');
const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: String,
  description: String,
  available: { type: Boolean, default: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});
module.exports = mongoose.model('MenuItem', MenuItemSchema);
