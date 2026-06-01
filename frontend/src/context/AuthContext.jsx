import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showRecipeFormModal, setShowRecipeFormModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('tlaxcala_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data);
      localStorage.setItem('tlaxcala_user', JSON.stringify(res.data));
      setShowLoginModal(false);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error en login' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      setUser(res.data);
      localStorage.setItem('tlaxcala_user', JSON.stringify(res.data));
      setShowRegisterModal(false);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error en registro' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tlaxcala_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, register, logout,
      showLoginModal, setShowLoginModal,
      showRegisterModal, setShowRegisterModal,
      showRecipeFormModal, setShowRecipeFormModal,
      showCreateAdminModal, setShowCreateAdminModal,
      selectedRecipe, setSelectedRecipe,
      editingRecipe, setEditingRecipe
    }}>
      {children}
    </AuthContext.Provider>
  );
};
