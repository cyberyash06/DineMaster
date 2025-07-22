import React, { useState, useEffect } from 'react';
import { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } from '../lib/api/menuapi';
import Sidebar from '../components/Sidebar';

export default function Menu() {
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
    }
  }


  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
    <h1 className='text-3xl bg-amber-500 decoration-2'>"Welcome to menu page</h1>
    </div>
  )
}