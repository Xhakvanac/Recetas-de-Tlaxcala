import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { setSelectedRecipe } = useContext(AuthContext);
  const [stats, setStats] = useState({ recipes: 0, cooks: 0, origins: 0, stories: 0 });
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchFeatured();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recipes/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFeatured = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recipes');
      // Just take first 3 as featured for simplicity
      setFeatured(res.data.slice(0, 3));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="homeSection">
      <div className="hero">
        <div className="hero-tag">🌽 Patrimonio Gastronómico de Tlaxcala</div>
        <h1>El sabor ancestral<br /><em>de Tlaxcala</em></h1>
        <p>Recetas auténticas tlaxcaltecas preservadas por nuestra comunidad de cocineros y cocineras tradicionales</p>
        <div className="hero-btns">
          <Link to="/recetas" className="btn-hero primary" style={{ textDecoration: 'none' }}>Explorar Platillos</Link>
          <Link to="/historia" className="btn-hero secondary" style={{ textDecoration: 'none' }}>Historia Gastronómica</Link>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '50px 2rem' }}>
        <div className="stats-row">
          <div className="stat-card"><div className="stat-val">{stats.recipes}</div><div className="stat-lbl">🫔 Platillos</div></div>
          <div className="stat-card"><div className="stat-val">{stats.cooks}</div><div className="stat-lbl">👩‍🍳 Cocineras/os</div></div>
          <div className="stat-card"><div className="stat-val">{stats.origins}</div><div className="stat-lbl">🏡 Municipios</div></div>
          <div className="stat-card"><div className="stat-val">{stats.stories}</div><div className="stat-lbl">📚 Historias</div></div>
        </div>

        <div className="section-header">
          <h2>Platillos <span>Destacados</span></h2>
          <Link to="/recetas" className="btn-sm view" style={{ textDecoration: 'none' }}>Ver todos →</Link>
        </div>
        <div className="recipe-grid">
          {featured.map(recipe => (
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
                  <button className="btn-sm view" onClick={(e) => { e.stopPropagation(); setSelectedRecipe(recipe); }}>Ver receta</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
