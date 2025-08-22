const MenuItem = require('../models/menu_item');
const Category = require('../models/category');

// ================================
//    CATEGORY CRUD OPERATIONS
// ================================

// GET all categories (with optional count of items in each)
// controllers/categoryController.js

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'menuitems',              // <- your menu items Mongo collection (check the name in DB)
          localField: '_id',
          foreignField: 'category',
          as: 'items'
        }
      },
      {
        $addFields: { itemCount: { $size: "$items" } }
      },
      {
        $project: { items: 0 }
      }
    ]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};


exports.addCategory = async (req, res) => {
  try {
    const { name, emoji } = req.body;
    if (!name || !emoji) {
      return res.status(400).json({ message: "Name and emoji are required" });
    }
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(409).json({ message: "Category already exists" });
    }
    const category = new Category({ name, emoji });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add category', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    // Optionally remove all related menu items
    await MenuItem.deleteMany({ category: req.params.id });
    res.json({ message: "Category and its items deleted" });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};

// ================================
//    MENU ITEM CRUD OPERATIONS
// ================================

// GET menu items (optionally filtered by category)
exports.getMenuItems = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const items = await MenuItem.find(filter).populate('category'); // .populate optional
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu items", error: error.message });
  }
};

// ADD new menu item (admin only)
exports.addMenuItem = async (req, res) => {
  try {
    const { name, price, category, description, image, available } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price & category are required" });
    }
    // Optionally validate category exists
    const cat = await Category.findById(category);
    if (!cat) {
      return res.status(404).json({ message: "Category not found" });
    }
    const item = new MenuItem({ name, price, category, description, image, available });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to add item", error: error.message });
  }
};

// UPDATE item
exports.updateMenuItem = async (req, res) => {
  try {
    const { name, price, category, description, image, available } = req.body;
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, price, category, description, image, available },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to update item", error: error.message });
  }
};

// DELETE menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item", error: error.message });
  }
};

// TOGGLE AVAILABILITY (PATCH)
exports.toggleItemAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    item.available = !item.available;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle availability", error: error.message });
  }
};
