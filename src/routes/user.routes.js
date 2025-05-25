const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// All routes require authentication and admin privileges
router.use(authenticateToken, isAdmin);

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Create new user
router.post('/', userController.createUser);

// Update user
router.put('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;