const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Get all products (public)
router.get('/', productController.getAllProducts);

// Get product by ID (public)
router.get('/:id', productController.getProductById);

// Protected routes - require authentication and admin privileges
router.use(authenticateToken, isAdmin);

// Create new product
router.post('/', productController.createProduct);

// Update product
router.put('/:id', productController.updateProduct);

// Toggle product availability
router.patch('/:id/availability', productController.toggleAvailability);

// Toggle product featured status
router.patch('/:id/featured', productController.toggleFeatured);

// Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;