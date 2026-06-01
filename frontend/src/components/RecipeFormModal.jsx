import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RecipeFormModal = ({ onRecipeSaved }) => {
  const { showRecipeFormModal, setShowRecipeFormModal, user, editingRecipe, setEditingRecipe } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '', category: 'Antojitos', origin: '', time: '', portions: '', calories: '',
    difficulty: 'Fácil', emoji: '🫔', color: '#f5ede0', desc: '', history: ''
  });
  const [ingredientsText, setIngredientsText] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [curiosidades, setCuriosidades] = useState(['']);
  const [images, setImages] = useState(['']);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingRecipe) {
      setFormData({
        name: editingRecipe.name,
        category: editingRecipe.category,
        origin: editingRecipe.origin,
        time: editingRecipe.time,
        portions: editingRecipe.portions,
        calories: editingRecipe.calories || '',
        difficulty: editingRecipe.difficulty,
        emoji: editingRecipe.emoji,
        color: editingRecipe.color,
        desc: editingRecipe.desc,
        history: editingRecipe.history || ''
      });
      setIngredientsText(editingRecipe.ingredients.join('\n'));
      setStepsText(editingRecipe.steps.join('\n'));
      setCuriosidades(editingRecipe.curiosidades.length > 0 ? editingRecipe.curiosidades : ['']);
      setImages(editingRecipe.images.length > 0 ? editingRecipe.images : ['']);
    } else {
      setFormData({
        name: '', category: 'Antojitos', origin: '', time: '', portions: '', calories: '',
        difficulty: 'Fácil', emoji: '🫔', color: '#f5ede0', desc: '', history: ''
      });
      setIngredientsText('');
      setStepsText('');
      setCuriosidades(['']);
      setImages(['']);
    }
  }, [editingRecipe, showRecipeFormModal]);

  if (!showRecipeFormModal) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleArrayChange = (setter, stateArray, index, value) => {
    const newArr = [...stateArray];
    newArr[index] = value;
    setter(newArr);
  };

  const handleClose = () => {
    setEditingRecipe(null);
    setShowRecipeFormModal(false);
  };

  const handleSubmit = async () => {
    try {
      setError('');
      
      // Validaciones robustas
      if (!formData.name.trim()) return setError('El nombre es obligatorio');
      if (!ingredientsText.trim()) return setError('Los ingredientes son obligatorios');
      if (!stepsText.trim()) return setError('Los pasos son obligatorios');
      if (!formData.history.trim()) return setError('El breviario histórico es obligatorio');
      if (images.filter(img => img.trim() !== '').length === 0) return setError('Debe agregar al menos una imagen');
      if (!formData.calories) return setError('El número de calorías es obligatorio');

      const payload = {
        ...formData,
        time: Number(formData.time),
        portions: Number(formData.portions),
        calories: Number(formData.calories),
        ingredients: ingredientsText.split('\n').filter(i => i.trim() !== ''),
        steps: stepsText.split('\n').filter(s => s.trim() !== ''),
        curiosidades: curiosidades.filter(c => c.trim() !== ''),
        images: images.filter(img => img.trim() !== '')
      };

      if (editingRecipe) {
        // Edit Recipe
        await axios.put(`/api/recipes/${editingRecipe._id}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        alert('Receta actualizada!');
      } else {
        // Add Recipe
        await axios.post('/api/recipes', payload, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        alert('Receta guardada exitosamente!');
      }

      handleClose();
      if (onRecipeSaved) onRecipeSaved();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="modal-overlay open">
      <div className="modal" style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h3>{editingRecipe ? '✏️ Editar Platillo' : 'Nuevo Platillo'}</h3>
          <button className="modal-close" onClick={handleClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="pending-notice" style={{ display: 'flex' }}>
            <span style={{ fontSize: '1.2rem' }}>⏳</span>
            <div>
              <strong>Revisión requerida</strong>
              Tu receta será enviada al administrador para su aprobación antes de publicarse en el sitio.
            </div>
          </div>
          
          <div className="form-grid" style={{ marginTop: '16px' }}>
            <div className="field full"><label>Nombre del platillo</label><input name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Tlayudas" /></div>
            
            <div className="field"><label>Categoría</label>
              <select name="category" onChange={handleChange} value={formData.category}>
                <option value="Antojitos">Antojitos</option>
                <option value="Sopas y Caldos">Sopas y Caldos</option>
                <option value="Platos Fuertes">Plato Fuerte</option>
                <option value="Moles y Salsas">Moles y Salsas</option>
                <option value="Postres y Dulces">Postres y Dulces</option>
                <option value="Bebidas Tradicionales">Bebidas Tradicionales</option>
                <option value="Tamales">Tamales</option>
              </select>
            </div>
            <div className="field"><label>Municipio / Región</label><input name="origin" value={formData.origin} onChange={handleChange} placeholder="Ej: Huamantla" /></div>
            
            <div className="field"><label>Tiempo (min)</label><input type="number" name="time" value={formData.time} onChange={handleChange} /></div>
            <div className="field"><label>Porciones</label><input type="number" name="portions" value={formData.portions} onChange={handleChange} /></div>
            <div className="field"><label>Calorías (kcal)</label><input type="number" name="calories" value={formData.calories} onChange={handleChange} placeholder="Calorías por ración" /></div>
            
            <div className="field"><label>Dificultad</label>
              <select name="difficulty" onChange={handleChange} value={formData.difficulty}>
                <option>Fácil</option><option>Media</option><option>Difícil</option>
              </select>
            </div>
            <div className="field"><label>Emoji / Ícono</label><input name="emoji" value={formData.emoji} onChange={handleChange} /></div>
            
            <div className="field"><label>Color de fondo</label><input type="color" name="color" value={formData.color} onChange={handleChange} /></div>
            <div className="field full"><label>Descripción corta</label><textarea name="desc" value={formData.desc} rows="2" onChange={handleChange}></textarea></div>
            
            <div className="field full"><label>Ingredientes (uno por línea)</label><textarea rows="4" value={ingredientsText} onChange={(e) => setIngredientsText(e.target.value)}></textarea></div>
            <div className="field full"><label>Pasos de preparación (uno por línea)</label><textarea rows="4" value={stepsText} onChange={(e) => setStepsText(e.target.value)}></textarea></div>
            
            <div className="field full"><label>Historia / Breviario del platillo</label><textarea rows="3" name="history" value={formData.history} onChange={handleChange}></textarea></div>
            
            <div className="field full">
              <label>Datos curiosos (opcional)</label>
              {curiosidades.map((cur, i) => (
                <div className="curiosidad-input-row" key={i} style={{ marginBottom: '8px' }}>
                  <input value={cur} onChange={(e) => handleArrayChange(setCuriosidades, curiosidades, i, e.target.value)} placeholder="Curiosidad..." />
                </div>
              ))}
              <button type="button" onClick={() => setCuriosidades([...curiosidades, ''])}>+ Añadir curiosidad</button>
            </div>

            <div className="field full">
              <label>Imágenes (URLs) - *Mínimo 1 requerida</label>
              {images.map((img, i) => (
                <div className="curiosidad-input-row" key={i} style={{ marginBottom: '8px' }}>
                  <input type="url" value={img} onChange={(e) => handleArrayChange(setImages, images, i, e.target.value)} placeholder="https://..." />
                </div>
              ))}
              <button type="button" onClick={() => setImages([...images, ''])}>+ Añadir imagen</button>
            </div>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="form-actions">
            <button className="btn-cancel" onClick={handleClose}>Cancelar</button>
            <button className="btn-primary" onClick={handleSubmit}>💾 Guardar Platillo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeFormModal;
