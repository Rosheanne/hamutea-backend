const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// All routes require authentication and admin privileges
router.use(authenticateToken, isAdmin);

// Get order statistics
router.get('/stats', orderController.getOrderStats);

// Get all orders
router.get('/', orderController.getAllOrders);

// Get order by ID
router.get('/:id', orderController.getOrderById);

// Update order status
router.put('/:id', orderController.updateOrderStatus);

module.exports = router;