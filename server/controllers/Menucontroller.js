const MenuItem = require('../models/Menuitem');

exports.getMenu = async (req, res) => {
  const items = await MenuItem.find();
  res.json(items);
};

exports.addMenuItem = async (req, res) => {
  const item = new MenuItem(req.body);
  await item.save();
  res.status(201).json(item);
};

exports.updateMenuItem = async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
};

exports.deleteMenuItem = async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
};