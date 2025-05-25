const db = require('../config/database');

/**
 * Get all orders
 * @route GET /api/orders
 */
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get order by ID with order items
 * @route GET /api/orders/:id
 */
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Get order details
    const [orders] = await db.query(`
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [orderId]);
    
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Get order items
    const [orderItems] = await db.query(`
      SELECT oi.*, p.name as product_name, p.image_url
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);
    
    const order = orders[0];
    order.items = orderItems;
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Update order status
 * @route PUT /api/orders/:id
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    
    // Validate request
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    // Validate status value
    const validStatuses = ['pending', 'processing', 'ready_for_pickup', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    // Check if order exists
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update order status
    await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        id: parseInt(orderId),
        status
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get order statistics
 * @route GET /api/orders/stats
 */
exports.getOrderStats = async (req, res) => {
  try {
    // Get total orders count
    const [totalOrders] = await db.query('SELECT COUNT(*) as count FROM orders');
    
    // Get orders by status
    const [ordersByStatus] = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `);
    
    // Get total revenue
    const [revenue] = await db.query(`
      SELECT SUM(total_amount) as total_revenue 
      FROM orders 
      WHERE status != 'cancelled'
    `);
    
    // Get recent orders
    const [recentOrders] = await db.query(`
      SELECT o.*, u.name as customer_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);
    
    res.status(200).json({
      success: true,
      data: {
        totalOrders: totalOrders[0].count,
        ordersByStatus,
        totalRevenue: revenue[0].total_revenue || 0,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};