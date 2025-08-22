import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import MenuHeader from '../components/MenuManagment/MenuHeader';
import SearchBar from '../components/ui/searchbar';
import CategorySection from '../components/MenuManagment/CategorySection';
import CategoryHeaderBar from '../components/MenuManagment/CategoryHeaderBar';
import FoodItemGrid from '../components/MenuManagment/FoodItemGrid';
import AddCategoryModal from '../components/MenuManagment/AddCategoryModal';
import AddItemModal from '../components/MenuManagment/AddItemModal';
import EditItemModal from '../components/MenuManagment/EditItemModal';
import DeleteConfirmModal from '../components/MenuManagment/DeleteConfirmationModal';

import { getCategories, addCategory, deleteCategory } from '../lib/api/categoryApi';
import {
  getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability
} from '../lib/api/menuApi';

// Remove useAuth and canEdit since you don't want permissions
// import useAuth from '../hooks/useAuth';

const getId = obj => obj?._id || obj?.id;  // Universal getter for any Mongo/JS object

const MenuManagement = () => {
  // const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);

  // Modal States
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // UI Loading States
  const [catLoading, setCatLoading] = useState(true);
  const [itemLoading, setItemLoading] = useState(false);

  // -------- Fetch Categories --------
  useEffect(() => {
    setCatLoading(true);
    getCategories()
      .then(data => {
        setCategories(data);
        // Default selection - pick first category if exists
        if (data && data.length > 0) setSelectedCategory(data[0]);
      })
      .catch(() => toast.error('Could not load categories.'))
      .finally(() => setCatLoading(false));
  }, []);

  // -------- Fetch Items for Selected Category --------
  useEffect(() => {
    if (!getId(selectedCategory)) {
      setItems([]);
      return;
    }
    setItemLoading(true);
    getMenuItems(getId(selectedCategory))
      .then(data => {
        setItems(data);
        
      })
      .catch(() => toast.error('Could not load items.'))
      .finally(() => setItemLoading(false));
  }, [selectedCategory]);

  // --- CATEGORY CRUD ---

  const handleAddCategory = async (categoryData) => {
    try {
      const newCat = await addCategory(categoryData);
      setCategories([...categories, newCat]);
      setShowAddCategoryModal(false);
      toast.success(`${newCat.name} category added successfully`);
      // Auto-select the new category if you want:
      setSelectedCategory(newCat);
    } catch {
      toast.error('Failed to add category');
    }
  };

  const handleDeleteCategory = (categoryId) => {
    // Accepts Mongo-style _id or JS id
    const category = categories.find(cat => getId(cat) === categoryId);
    setDeleteTarget({ type: 'category', id: categoryId, name: category?.name });
    setShowDeleteModal(true);
  };

  // --- ITEM CRUD ---

  const handleAddItem = async (itemData) => {
    try {
      // For backend, 'category' field should be selectedCategory._id
      const created = await addMenuItem({ ...itemData, category: getId(selectedCategory) });
      setItems([...items, created]);
      setShowAddItemModal(false);
      toast.success(`${created.name} added successfully`);
    } catch {
      toast.error('Failed to add item');
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowEditItemModal(true);
  };

  const handleUpdateItem = async (updatedItemData) => {
    try {
      const updated = await updateMenuItem(getId(editingItem), updatedItemData);
      setItems(items.map(item => getId(item) === getId(editingItem) ? updated : item));
      setShowEditItemModal(false);
      setEditingItem(null);
      toast.success(`${updated.name} updated successfully`);
    } catch {
      toast.error('Failed to update item');
    }
  };

  const handleDeleteItem = (item) => {
    setDeleteTarget({ type: 'item', id: getId(item), name: item.name });
    setShowDeleteModal(true);
  };

  const handleToggleAvailability = async (itemId) => {
    try {
      const updated = await toggleItemAvailability(itemId);
      setItems(items.map(item => getId(item) === getId(updated) ? updated : item));
      toast.success('Item availability updated');
    } catch {
      toast.error('Failed to update availability');
    }
  };

  // ----- Delete Confirm Handler -----
  const confirmDelete = async () => {
    if (deleteTarget.type === 'category') {
      try {
        const deletedCategoryName = deleteTarget.name;
        await deleteCategory(deleteTarget.id);
        const updatedCategories = await getCategories();
        setCategories(updatedCategories);
        if (selectedCategory && getId(selectedCategory) === deleteTarget.id) {
          setSelectedCategory(null);
          setItems([]);
        }
        toast.success(`${deletedCategoryName} category deleted`);
      } catch {
        toast.error('Failed to delete category');
      }
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } else if (deleteTarget.type === 'item') {
      try {
        await deleteMenuItem(deleteTarget.id);
        setItems(items.filter(item => getId(item) !== deleteTarget.id));
        toast.success(`${deleteTarget.name} deleted`);
      } catch {
        toast.error('Failed to delete item');
      }
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Filter items by search
  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <MenuHeader />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <CategorySection
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddCategory={() => setShowAddCategoryModal(true)}
          canEdit
          loading={catLoading}
        />

        {selectedCategory && (
          <CategoryHeaderBar
            selectedCategory={selectedCategory}
            onAddItem={() => setShowAddItemModal(true)}
          // No canEdit, always visible
          />
        )}

        <FoodItemGrid
          items={filteredItems}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onToggleAvailability={handleToggleAvailability}
          canEdit
          loading={itemLoading}
        />
      </div>

      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onSave={handleAddCategory}
      />

      <AddItemModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onSave={handleAddItem}
        categoryName={selectedCategory?.name}
      />

      <EditItemModal
        isOpen={showEditItemModal}
        onClose={() => {
          setShowEditItemModal(false);
          setEditingItem(null);
        }}
        onSave={handleUpdateItem}
        item={editingItem}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        target={deleteTarget}
      />
    </div>
  );
};

export default MenuManagement;
