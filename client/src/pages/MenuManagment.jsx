import React, { useState, useEffect } from 'react';
import { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } from '../api/menuApi';

const MenuManagement = () => {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    const res = await getMenu();
    setMenu(res.data);
  }}