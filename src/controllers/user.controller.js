const bcrypt = require('bcryptjs');
const db = require('../config/database');

/**
 * Get all users
 * @route GET /api/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get user by ID
 * @route GET /api/users/:id
 */
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const [users] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Create new user
 * @route POST /api/users
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate request
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }
    
    // Check if email already exists
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'user']
    );
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: result.insertId,
        name,
        email,
        role: role || 'user'
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Update user
 * @route PUT /api/users/:id
 */
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if email is already in use by another user
    if (email && email !== users[0].email) {
      const [existingUsers] = await db.query(
        'SELECT id FROM users WHERE email = ? AND id != ?', 
        [email, userId]
      );
      
      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }
    
    // If password is provided, hash it
    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }
    
    // Update user with or without password
    if (password) {
      await db.query(
        'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
        [
          name || users[0].name,
          email || users[0].email,
          hashedPassword,
          role || users[0].role,
          userId
        ]
      );
    } else {
      await db.query(
        'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
        [
          name || users[0].name,
          email || users[0].email,
          role || users[0].role,
          userId
        ]
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: parseInt(userId),
        name: name || users[0].name,
        email: email || users[0].email,
        role: role || users[0].role
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Delete user
 * @route DELETE /api/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const [users] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Delete user
    await db.query('DELETE FROM users WHERE id = ?', [userId]);
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};