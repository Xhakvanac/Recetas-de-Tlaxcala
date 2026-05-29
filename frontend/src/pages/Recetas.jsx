import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import RecipeFormModal from '../components/RecipeFormModal';

const Recetas = () => {
  const { user, setShowRecipeFormModal, setSelectedRecipe, setEditingRecipe } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recipes');
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (e, recipe) => {
    e.stopPropagation();
    setEditingRecipe(recipe);
    setShowRecipeFormModal(true);
  };

  const handleDeleteClick = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('¿Seguro que deseas eliminar este platillo?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Platillo eliminado!');
      fetchRecipes();
    } catch (err) {
      console.error(err);
      alert('Error eliminando platillo');
    }
  };

  const categories = ['all', 'Antojitos', 'Sopas y Caldos', 'Platos Fuertes', 'Moles y Salsas', 'Postres y Dulces', 'Bebidas Tradicionales', 'Tamales'];

  const filteredRecipes = activeCategory === 'all' 
    ? recipes 
    : recipes.filter(r => r.category === activeCategory);

  return (
    <div className="section visible">
      <div className="section-header">
        <h2>Platillos <span>Tlaxcaltecas</span></h2>
        {user && (
          <button className="btn-primary" onClick={() => { setEditingRecipe(null); setShowRecipeFormModal(true); }}>+ Nuevo Platillo</button>
        )}
      </div>
      
      <div className="filters">
        {categories.map(c => (
          <button 
            key={c} 
            className={`filter-btn ${activeCategory === c ? 'active' : ''}`} 
            onClick={() => setActiveCategory(c)}
          >
            {c === 'all' ? '🫔 Todos' : c}
          </button>
        ))}
      </div>

      <div className="recipe-grid">
        {filteredRecipes.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="empty-icon">🫕</div>
            <h3>No hay platillos aquí aún</h3>
          </div>
        ) : (
          filteredRecipes.map(recipe => {
            const canEdit = user && (user._id === recipe.authorId || user.role === 'admin');
            const canDelete = user && user.role === 'admin';
            return (
              <div className="recipe-card" key={recipe._id} onClick={() => setSelectedRecipe(recipe)}>
                <div className="recipe-thumb" style={{ backgroundColor: recipe.color || '#f5ede0' }}>
                  <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>{recipe.emoji || '🫔'}</span>
                  <div className="recipe-badge">{recipe.difficulty}</div>
                </div>
                <div className="recipe-body">
                  <h3 className="recipe-title">{recipe.name}</h3>
                  <div className="recipe-meta">
                    <span>⏱ {recipe.time} min</span>
                    <span>🍴 {recipe.portions} porciones</span>
                    <span>🔥 {recipe.calories} kcal</span>
                    <span>📍 {recipe.origin}</span>
                  </div>
                  <p className="recipe-desc">{recipe.desc}</p>
                  <div className="recipe-author">
                    <span>👩‍🍳 {recipe.authorName}</span>
                    <div className="recipe-actions">
                      <button className="btn-sm view" onClick={(e) => { e.stopPropagation(); setSelectedRecipe(recipe); }}>Ver receta</button>
                      {canEdit && <button className="btn-sm edit" onClick={(e) => handleEditClick(e, recipe)}>Editar</button>}
                      {canDelete && <button className="btn-sm delete" onClick={(e) => handleDeleteClick(e, recipe._id)}>🗑</button>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <RecipeFormModal onRecipeSaved={fetchRecipes} />
    </div>
  );
};

export default Recetas;
