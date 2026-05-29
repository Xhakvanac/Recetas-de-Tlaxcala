const express = require('express');
const router = express.Router();
const { 
  getRecipes, 
  getRecipesAll,
  getRecipeById, 
  getPendingRecipes, 
  createRecipe, 
  updateRecipe, 
  deleteRecipe, 
  updateRecipeStatus,
  getStats
} = require('../controllers/recipeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getRecipes);
router.get('/stats', getStats);
router.get('/all', protect, adminOnly, getRecipesAll);
router.get('/pending', protect, adminOnly, getPendingRecipes);
router.get('/:id', getRecipeById);

router.post('/', protect, createRecipe);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.put('/:id/status', protect, adminOnly, updateRecipeStatus);

module.exports = router;
