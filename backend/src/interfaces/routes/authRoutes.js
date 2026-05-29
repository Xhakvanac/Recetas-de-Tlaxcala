const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, createAdmin, deleteUser, updateUser } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, adminOnly, getUsers);
router.post('/create-admin', protect, adminOnly, createAdmin);
router.put('/users/:id', protect, adminOnly, updateUser);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
