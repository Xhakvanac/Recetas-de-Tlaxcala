const Recipe = require('../../domain/models/Recipe');
const User = require('../../domain/models/User');

const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: 'aprobada' });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo recetas' });
  }
};

const getRecipesAll = async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo todas las recetas' });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Receta no encontrada' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo la receta' });
  }
};

const getPendingRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: 'pendiente' });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo recetas pendientes' });
  }
};

const createRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Si es administrador, se aprueba automáticamente
    const status = user.role === 'admin' ? 'aprobada' : 'pendiente';

    const newRecipe = new Recipe({
      ...req.body,
      authorId: user._id,
      authorName: `${user.name} ${user.lastName}`,
      status
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: 'Error creando receta', error: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Receta no encontrada' });

    // Solo el autor o el administrador pueden editar
    if (recipe.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para editar esta receta' });
    }

    // Si edita un usuario común, vuelve a pasar a pendiente
    const status = req.user.role === 'admin' ? recipe.status : 'pendiente';

    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error actualizando receta', error: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Receta no encontrada' });

    // Solo el autor o el administrador pueden eliminar
    if (recipe.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para eliminar esta receta' });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Receta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando receta' });
  }
};

const updateRecipeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!recipe) return res.status(404).json({ message: 'Receta no encontrada' });
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: 'Error actualizando receta', error: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const recipesCount = await Recipe.countDocuments({ status: 'aprobada' });
    const usersCount = await User.countDocuments({ role: 'usuario' });
    const origins = await Recipe.distinct('origin', { status: 'aprobada' });
    
    res.json({
      recipes: recipesCount,
      cooks: usersCount,
      origins: origins.length,
      stories: 5 // Las 5 historias estáticas
    });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo estadísticas' });
  }
};

module.exports = { 
  getRecipes, 
  getRecipesAll,
  getRecipeById,
  getPendingRecipes, 
  createRecipe, 
  updateRecipe,
  deleteRecipe,
  updateRecipeStatus,
  getStats
};
