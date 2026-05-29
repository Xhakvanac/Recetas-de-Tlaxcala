import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Admin = () => {
  const { user, setShowCreateAdminModal } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      if (activeTab === 'pending') fetchPending();
      if (activeTab === 'recipes') fetchAllRecipes();
      if (activeTab === 'users') fetchUsers();
    }
  }, [user, activeTab]);

  const fetchPending = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recipes/pending', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setPendingRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllRecipes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recipes/all', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAllRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUsersList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/recipes/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchPending();
    } catch (err) {
      alert('Error actualizando estado');
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este platillo?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Platillo eliminado correctamente');
      fetchAllRecipes();
    } catch (err) {
      alert('Error al eliminar platillo');
    }
  };

  const handleDeleteUser = async (id) => {
    if (id === user._id) {
      return alert('No puedes eliminar tu propio usuario.');
    }
    if (!window.confirm('¿Seguro que deseas eliminar este usuario? Sus recetas asociadas seguirán existiendo pero no tendrán autor activo.')) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Usuario eliminado correctamente');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const handleToggleRole = async (targetUser) => {
    if (targetUser._id === user._id) {
      return alert('No puedes cambiar tu propio rol.');
    }
    const newRole = targetUser.role === 'admin' ? 'usuario' : 'admin';
    if (!window.confirm(`¿Seguro que deseas cambiar el rol de este usuario a "${newRole}"?`)) return;
    try {
      await axios.put(`http://localhost:5000/api/auth/users/${targetUser._id}`, {
        ...targetUser,
        role: newRole
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Rol actualizado correctamente');
      fetchUsers();
    } catch (err) {
      alert('Error al actualizar el rol de usuario');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Acceso denegado. Solo administradores.</div>;
  }

  return (
    <div className="section visible">
      <div className="section-header">
        <h2>Panel de <span>Administración</span></h2>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>👥 Usuarios</button>
        <button className={`admin-tab ${activeTab === 'recipes' ? 'active' : ''}`} onClick={() => setActiveTab('recipes')}>📖 Platillos</button>
        <button className={`admin-tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>⏳ Pendientes</button>
        <button className="admin-tab" onClick={() => setShowCreateAdminModal(true)} style={{ marginLeft: 'auto', color: 'var(--gold)' }}>👑 + Crear Admin</button>
      </div>

      {activeTab === 'users' && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Especialidad / Municipio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map(u => (
              <tr key={u._id}>
                <td>{u.name} {u.lastName}</td>
                <td>{u.email}</td>
                <td><span className={`role-tag ${u.role}`}>{u.role}</span></td>
                <td>{u.specialty}</td>
                <td>
                  <button className="btn-sm edit" onClick={() => handleToggleRole(u)} style={{ marginRight: '8px' }}>Rol</button>
                  <button className="btn-sm delete" onClick={() => handleDeleteUser(u._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'recipes' && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Platillo</th>
              <th>Categoría</th>
              <th>Origen</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {allRecipes.map(r => (
              <tr key={r._id}>
                <td>{r.emoji} {r.name}</td>
                <td>{r.category}</td>
                <td>{r.origin}</td>
                <td><span className={`status-badge ${r.status === 'aprobada' ? 'approved' : r.status === 'pendiente' ? 'pending' : 'rejected'}`}>{r.status}</span></td>
                <td>
                  <button className="btn-sm delete" onClick={() => handleDeleteRecipe(r._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'pending' && (
        <div>
          {pendingRecipes.length === 0 ? (
            <div className="empty-pending">
              <div className="ep-icon">☕</div>
              <h4>Todo al día</h4>
              <p>No hay recetas pendientes por revisar.</p>
            </div>
          ) : (
            pendingRecipes.map(recipe => (
              <div className="approval-card" key={recipe._id}>
                <div className="ac-emoji">{recipe.emoji}</div>
                <div className="ac-body">
                  <h4 className="ac-title">{recipe.name}</h4>
                  <div className="ac-meta">Por: {recipe.authorName} • {new Date(recipe.createdAt).toLocaleDateString()}</div>
                  <p className="ac-desc">{recipe.desc}</p>
                  <div className="approval-actions">
                    <button className="btn-approve" onClick={() => handleStatusUpdate(recipe._id, 'aprobada')}>Aprobar</button>
                    <button className="btn-reject" onClick={() => handleStatusUpdate(recipe._id, 'rechazada')}>Rechazar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
