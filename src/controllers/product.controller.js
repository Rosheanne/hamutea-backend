const db = require('../config/database');

/**
 * Get all products
 * @route GET /api/products
 */
exports.getAllProducts = async (req, res) => {
  try {
    const { category, featured } = req.query;
    
    let query = 'SELECT * FROM products';
    const params = [];
    
    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
      
      if (featured === 'true') {
        query += ' AND is_featured = TRUE';
      }
    } else if (featured === 'true') {
      query += ' WHERE is_featured = TRUE';
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [products] = await db.query(query, params);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get product by ID
 * @route GET /api/products/:id
 */
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    
    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: products[0]
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Create new product
 * @route POST /api/products
 */
exports.createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      stock_quantity, 
      category, 
      image_url,
      is_available,
      is_featured
    } = req.body;
    
    // Validate request
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }
    
    // Insert product
    const [result] = await db.query(
      `INSERT INTO products 
       (name, description, price, stock_quantity, category, image_url, is_available, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        description || '', 
        price, 
        stock_quantity || 0, 
        category, 
        image_url || '',
        is_available !== undefined ? (is_available ? 1 : 0) : 1,
        is_featured !== undefined ? (is_featured ? 1 : 0) : 0
      ]
    );
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        id: result.insertId,
        name,
        description: description || '',
        price,
        stock_quantity: stock_quantity || 0,
        category,
        image_url: image_url || '',
        is_available: is_available !== undefined ? is_available : true,
        is_featured: is_featured !== undefined ? is_featured : false
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Update product
 * @route PUT /api/products/:id
 */
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { 
      name, 
      description, 
      price, 
      stock_quantity, 
      category, 
      image_url,
      is_available,
      is_featured
    } = req.body;
    
    // Check if product exists
    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ?', 
      [productId]
    );
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const product = products[0];
    
    // Update product
    await db.query(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, 
           stock_quantity = ?, category = ?, image_url = ?,
           is_available = ?, is_featured = ?
       WHERE id = ?`,
      [
        name || product.name,
        description !== undefined ? description : product.description,
        price !== undefined ? price : product.price,
        stock_quantity !== undefined ? stock_quantity : product.stock_quantity,
        category || product.category,
        image_url !== undefined ? image_url : product.image_url,
        is_available !== undefined ? (is_available ? 1 : 0) : product.is_available,
        is_featured !== undefined ? (is_featured ? 1 : 0) : product.is_featured,
        productId
      ]
    );
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: {
        id: parseInt(productId),
        name: name || product.name,
        description: description !== undefined ? description : product.description,
        price: price !== undefined ? price : product.price,
        stock_quantity: stock_quantity !== undefined ? stock_quantity : product.stock_quantity,
        category: category || product.category,
        image_url: image_url !== undefined ? image_url : product.image_url,
        is_available: is_available !== undefined ? is_available : product.is_available,
        is_featured: is_featured !== undefined ? is_featured : product.is_featured
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Toggle product availability
 * @route PATCH /api/products/:id/availability
 */
exports.toggleAvailability = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check if product exists
    const [products] = await db.query(
      'SELECT id, is_available FROM products WHERE id = ?', 
      [productId]
    );
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const currentStatus = products[0].is_available;
    
    // Toggle availability
    await db.query(
      'UPDATE products SET is_available = ? WHERE id = ?',
      [currentStatus ? 0 : 1, productId]
    );
    
    res.status(200).json({
      success: true,
      message: `Product is now ${!currentStatus ? 'available' : 'unavailable'}`,
      data: {
        id: parseInt(productId),
        is_available: !currentStatus
      }
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Toggle featured status
 * @route PATCH /api/products/:id/featured
 */
exports.toggleFeatured = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check if product exists
    const [products] = await db.query(
      'SELECT id, is_featured FROM products WHERE id = ?', 
      [productId]
    );
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const currentStatus = products[0].is_featured;
    
    // Toggle featured status
    await db.query(
      'UPDATE products SET is_featured = ? WHERE id = ?',
      [currentStatus ? 0 : 1, productId]
    );
    
    res.status(200).json({
      success: true,
      message: `Product is ${!currentStatus ? 'now featured' : 'no longer featured'}`,
      data: {
        id: parseInt(productId),
        is_featured: !currentStatus
      }
    });
  } catch (error) {
    console.error('Toggle featured status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Delete product
 * @route DELETE /api/products/:id
 */
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check if product exists
    const [products] = await db.query(
      'SELECT id FROM products WHERE id = ?', 
      [productId]
    );
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Delete product
    await db.query('DELETE FROM products WHERE id = ?', [productId]);
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};