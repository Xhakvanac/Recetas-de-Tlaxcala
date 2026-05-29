import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const RecipeDetailModal = () => {
  const { selectedRecipe, setSelectedRecipe } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('receta');

  if (!selectedRecipe) return null;

  const r = selectedRecipe;
  const hasImages = r.images && r.images.length > 0 && r.images[0] !== '';
  const hasHistory = r.history && r.history.trim() !== '';
  const hasCuriosidades = r.curiosidades && r.curiosidades.length > 0 && r.curiosidades[0] !== '';

  return (
    <div className="modal-overlay open">
      <div className="modal" style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <h3>{r.name}</h3>
          <button className="modal-close" onClick={() => setSelectedRecipe(null)}>✕</button>
        </div>
        <div className="modal-body">
          {hasImages ? (
            <div className="recipe-img-gallery" style={{ marginBottom: '16px' }}>
              {r.images.map((url, idx) => (
                <img key={idx} src={url} alt={r.name} onError={(e) => e.target.style.display = 'none'} />
              ))}
            </div>
          ) : (
            <div className="detail-hero" style={{ backgroundColor: r.color || '#f5ede0' }}>
              {r.emoji || '🫔'}
            </div>
          )}

          <div className="detail-title">{r.name}</div>
          <div className="detail-by">Por {r.authorName} · {r.origin}</div>

          <div className="detail-meta" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
            <div className="detail-meta-item"><div className="icon">⏱</div><div className="val">{r.time} min</div><div className="lbl">Tiempo</div></div>
            <div className="detail-meta-item"><div className="icon">🍴</div><div className="val">{r.portions}</div><div className="lbl">Porciones</div></div>
            <div className="detail-meta-item"><div className="icon">🔥</div><div className="val">{r.calories} kcal</div><div className="lbl">Calorías</div></div>
            <div className="detail-meta-item"><div className="icon">📊</div><div className="val">{r.difficulty}</div><div className="lbl">Dificultad</div></div>
            <div className="detail-meta-item"><div className="icon">📍</div><div className="val" style={{ fontSize: '0.8rem' }}>{r.origin}</div><div className="lbl">Municipio</div></div>
          </div>

          <div className="detail-tabs">
            <button className={`detail-tab ${activeTab === 'receta' ? 'active' : ''}`} onClick={() => setActiveTab('receta')}>🫔 Receta</button>
            {hasHistory && <button className={`detail-tab ${activeTab === 'historia' ? 'active' : ''}`} onClick={() => setActiveTab('historia')}>📜 Historia / Breviario</button>}
            {hasCuriosidades && <button className={`detail-tab ${activeTab === 'curiosidades' ? 'active' : ''}`} onClick={() => setActiveTab('curiosidades')}>💡 Datos curiosos</button>}
          </div>

          {activeTab === 'receta' && (
            <div className="detail-tab-panel active">
              <div className="detail-desc">{r.desc}</div>
              <div className="detail-h">🌿 Ingredientes</div>
              <ul className="ingredients-list">
                {r.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
              <div className="detail-h">👩‍🍳 Preparación</div>
              <ol className="steps-list">
                {r.steps.map((step, idx) => (
                  <li key={idx}>
                    <span className="step-num">{idx + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {activeTab === 'historia' && hasHistory && (
            <div className="detail-tab-panel active">
              <div className="recipe-history-box">
                <div className="rh-header">
                  <span style={{ fontSize: '1.4rem' }}>📜</span>
                  <h4>Historia del platillo</h4>
                </div>
                <p style={{ whiteSpace: 'pre-line' }}>{r.history}</p>
              </div>
            </div>
          )}

          {activeTab === 'curiosidades' && hasCuriosidades && (
            <div className="detail-tab-panel active">
              <div className="detail-h" style={{ marginBottom: '14px' }}>💡 Datos Curiosos</div>
              <div className="curiosidades-list">
                {r.curiosidades.map((c, idx) => (
                  <div className="curiosidad-item" key={idx}>
                    <span className="ci-icon">🌟</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailModal;
