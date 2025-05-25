const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const upload = require('../config/upload');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// All routes require authentication and admin privileges
router.use(authenticateToken, isAdmin);

// Upload product image
router.post('/product-image', upload.single('image'), uploadController.uploadProductImage);

module.exports = router;