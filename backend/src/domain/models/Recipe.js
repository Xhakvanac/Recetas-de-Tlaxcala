const mongoose = require('mongoose');

// La arquitectura pide que las 6 secciones sean obligatorias:
// 1. Información General, 2. Ingredientes, 3. Pasos, 4. Historia, 5. Curiosidades, 6. Imágenes
const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  origin: { type: String, required: true },
  time: { type: Number, required: true },
  portions: { type: Number, required: true },
  calories: { type: Number, required: true },
  difficulty: { type: String, required: true },
  emoji: { type: String, required: true },
  color: { type: String, default: '#f5ede0' },
  desc: { type: String, required: true },
  
  // Las 6 secciones requeridas
  ingredients: { 
    type: [String], 
    required: true,
    validate: [v => v.length > 0, 'Debe haber al menos un ingrediente'] 
  },
  steps: { 
    type: [String], 
    required: true,
    validate: [v => v.length > 0, 'Debe haber al menos un paso de preparación'] 
  },
  history: { type: String, required: true },
  curiosidades: { 
    type: [String], 
    required: true,
    validate: [v => v.length > 0, 'Debe haber al menos un dato curioso'] 
  },
  images: { 
    type: [String], 
    required: true,
    validate: [v => v.length > 0, 'Debe haber al menos una imagen'] 
  },

  // Auditoría y relaciones
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pendiente', 'aprobada', 'rechazada'], 
    default: 'pendiente' 
  },
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
